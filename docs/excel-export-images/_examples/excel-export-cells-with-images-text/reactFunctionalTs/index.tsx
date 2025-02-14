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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { createBase64FlagsFromResponse } from "./imageUtils";
import { FlagContext } from "./interfaces";
import CountryCellRenderer from "./countryCellRenderer.tsx";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const countryCodes: any = {};

const base64flags: any = {};

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", width: 200 },
    {
      field: "country",
      cellClass: "countryCell",
      cellRenderer: CountryCellRenderer,
    },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 150,
    };
  }, []);
  const excelStyles = useMemo<ExcelStyle[]>(() => {
    return [
      {
        id: "countryCell",
        alignment: {
          vertical: "Center",
          indent: 4,
        },
      },
    ];
  }, []);
  const defaultExcelExportParams = useMemo<ExcelExportParams>(() => {
    return {
      addImageToCell: (rowIndex, col, value) => {
        if (col.getColId() !== "country") {
          return;
        }
        const countryCode = countryCodes[value];
        return {
          image: {
            id: countryCode,
            base64: base64flags[countryCode],
            imageType: "png",
            width: 20,
            height: 11,
            position: {
              offsetX: 10,
              offsetY: 5.5,
            },
          },
          value,
        };
      },
    };
  }, []);
  const context = useMemo(() => {
    return {
      base64flags: base64flags,
      countryCodes: countryCodes,
    } as FlagContext;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((data) =>
        createBase64FlagsFromResponse(data, countryCodes, base64flags),
      )
      .then((data) => params.api.setGridOption("rowData", data));
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div>
          <button className="export" onClick={onBtExport}>
            Export to Excel
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact<IOlympicData>
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              excelStyles={excelStyles}
              defaultExcelExportParams={defaultExcelExportParams}
              context={context}
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
