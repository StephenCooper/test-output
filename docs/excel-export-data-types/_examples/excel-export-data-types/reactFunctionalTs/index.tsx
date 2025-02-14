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
  CsvExportModule,
  ExcelStyle,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    {
      rawValue: 1,
      negativeValue: -10,
      dateValue: "2009-04-20T00:00:00.000",
    },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "provided", field: "rawValue" },
    { headerName: "number", field: "rawValue", cellClass: "numberType" },
    { headerName: "currency", field: "rawValue", cellClass: "currencyFormat" },
    { headerName: "boolean", field: "rawValue", cellClass: "booleanType" },
    {
      headerName: "Negative",
      field: "negativeValue",
      cellClass: "negativeInBrackets",
    },
    { headerName: "string", field: "rawValue", cellClass: "stringType" },
    {
      headerName: "Date",
      field: "dateValue",
      cellClass: "dateType",
      minWidth: 220,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const excelStyles = useMemo<ExcelStyle[]>(() => {
    return [
      {
        id: "numberType",
        numberFormat: {
          format: "0",
        },
      },
      {
        id: "currencyFormat",
        numberFormat: {
          format: "#,##0.00 €",
        },
      },
      {
        id: "negativeInBrackets",
        numberFormat: {
          format: "$[blue] #,##0;$ [red](#,##0)",
        },
      },
      {
        id: "booleanType",
        dataType: "Boolean",
      },
      {
        id: "stringType",
        dataType: "String",
      },
      {
        id: "dateType",
        dataType: "DateTime",
      },
    ];
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <button onClick={onBtExport} style={{ fontWeight: "bold" }}>
            Export to Excel
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            excelStyles={excelStyles}
            popupParent={popupParent}
          />
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
