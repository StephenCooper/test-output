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
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
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
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Athlete Details",
      children: [
        {
          field: "athlete",
          width: 180,
          filter: "agTextColumnFilter",
        },
        {
          field: "age",
          width: 90,
          filter: "agNumberColumnFilter",
        },
        { headerName: "Country", field: "country", width: 140 },
      ],
    },
    {
      headerName: "Sports Results",
      children: [
        { field: "sport", width: 140 },
        {
          columnGroupShow: "closed",
          field: "total",
          width: 100,
          filter: "agNumberColumnFilter",
        },
        {
          columnGroupShow: "open",
          field: "gold",
          width: 100,
          filter: "agNumberColumnFilter",
        },
        {
          columnGroupShow: "open",
          field: "silver",
          width: 100,
          filter: "agNumberColumnFilter",
        },
        {
          columnGroupShow: "open",
          field: "bronze",
          width: 100,
          filter: "agNumberColumnFilter",
        },
      ],
    },
  ]);
  const defaultExcelExportParams = useMemo<ExcelExportParams>(() => {
    return {
      freezeRows: "headers",
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div className="columns">
          <div>
            <button onClick={onBtExport} style={{ fontWeight: "bold" }}>
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
              defaultExcelExportParams={defaultExcelExportParams}
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
(window as any).tearDownExample = () => root.unmount();
