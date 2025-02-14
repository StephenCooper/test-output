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
  ICellRendererParams,
  ModuleRegistry,
  RowAutoHeightModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import MultilineCellRenderer from "./multilineCellRenderer.tsx";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
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
      address:
        "1197 Thunder Wagon Common,\nCataract, RI, \n02987-1016, US, \n(401) 747-0763",
      col1: "abc",
      col2: "xyz",
    },
    {
      address:
        "3685 Rocky Glade, Showtucket, NU, \nX1E-9I0, CA, \n(867) 371-4215",
      col1: "abc",
      col2: "xyz",
    },
    {
      address:
        "3235 High Forest, Glen Campbell, MS, \n39035-6845, US, \n(601) 638-8186",
      col1: "abc",
      col2: "xyz",
    },
    {
      address:
        "2234 Sleepy Pony Mall , Drain, DC, \n20078-4243, US, \n(202) 948-3634",
      col1: "abc",
      col2: "xyz",
    },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "address" },
    {
      headerName: "Custom column",
      autoHeight: true,
      valueGetter: (param) => {
        return param.data.col1 + "\n" + param.data.col2;
      },
      cellRenderer: MultilineCellRenderer,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellClass: "multiline",
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const excelStyles = useMemo<ExcelStyle[]>(() => {
    return [
      {
        id: "multiline",
        alignment: {
          wrapText: true,
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
            style={{ margin: "5px 0px", fontWeight: "bold" }}
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
(window as any).tearDownExample = () => root.unmount();
