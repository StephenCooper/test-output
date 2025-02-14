"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

function getBoolean(id: string) {
  return !!(document.querySelector("#" + id) as HTMLInputElement).checked;
}

function getParams() {
  return {
    skipPinnedTop: getBoolean("skipPinnedTop"),
    skipPinnedBottom: getBoolean("skipPinnedBottom"),
  };
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Top Level Column Group",
      children: [
        {
          headerName: "Group A",
          children: [
            { field: "athlete", minWidth: 200 },
            { field: "country", minWidth: 200 },
            { headerName: "Group", valueGetter: "data.country.charAt(0)" },
          ],
        },
        {
          headerName: "Group B",
          children: [
            { field: "date", minWidth: 150 },
            { field: "sport", minWidth: 150 },
            { field: "gold" },
            { field: "silver" },
            { field: "bronze" },
            { field: "total" },
          ],
        },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const pinnedTopRowData = useMemo<any[]>(() => {
    return [
      {
        athlete: "Floating <Top> Athlete",
        country: "Floating <Top> Country",
        date: "01/08/2020",
        sport: "Track & Field",
        gold: 22,
        silver: 3,
        bronze: 44,
        total: 69,
      } as any,
    ];
  }, []);
  const pinnedBottomRowData = useMemo<any[]>(() => {
    return [
      {
        athlete: "Floating <Bottom> Athlete",
        country: "Floating <Bottom> Country",
        date: "01/08/2030",
        sport: "Track & Field",
        gold: 222,
        silver: 5,
        bronze: 244,
        total: 471,
      } as any,
    ];
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) =>
        setRowData(data.filter((rec: any) => rec.country != null)),
      );
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel(getParams());
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div className="columns">
          <div className="column">
            <label htmlFor="skipPinnedTop">
              <input id="skipPinnedTop" type="checkbox" />
              Skip Pinned Top Rows
            </label>
          </div>
          <div className="column">
            <label htmlFor="skipPinnedBottom">
              <input id="skipPinnedBottom" type="checkbox" />
              Skip Pinned Bottom Rows
            </label>
          </div>
          <div>
            <button
              onClick={onBtExport}
              style={{ margin: "5px 0px", fontWeight: "bold" }}
            >
              Export to Excel
            </button>
          </div>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact<IOlympicData>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              popupParent={popupParent}
              pinnedTopRowData={pinnedTopRowData}
              pinnedBottomRowData={pinnedBottomRowData}
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
