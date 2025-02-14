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
    { company: "Google", url: "https://www.google.com" },
    { company: "Adobe", url: "https://www.adobe.com" },
    { company: "The New York Times", url: "https://www.nytimes.com" },
    { company: "Twitter", url: "https://www.twitter.com" },
    { company: "StackOverflow", url: "https://stackoverflow.com/" },
    { company: "Reddit", url: "https://www.reddit.com" },
    { company: "GitHub", url: "https://www.github.com" },
    { company: "Microsoft", url: "https://www.microsoft.com" },
    { company: "Gizmodo", url: "https://www.gizmodo.com" },
    { company: "LinkedIN", url: "https://www.linkedin.com" },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "company" },
    { field: "url", cellClass: "hyperlinks" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const defaultExcelExportParams = useMemo<ExcelExportParams>(() => {
    return {
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        const field = params.column.getColDef().field;
        return field === "url" ? `=HYPERLINK("${params.value}")` : params.value;
      },
    };
  }, []);
  const excelStyles = useMemo<ExcelStyle[]>(() => {
    return [
      {
        id: "hyperlinks",
        font: {
          underline: "Single",
          color: "#358ccb",
        },
      },
    ];
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div>
          <button
            onClick={onBtExport}
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            Export to Excel
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              defaultExcelExportParams={defaultExcelExportParams}
              excelStyles={excelStyles}
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
