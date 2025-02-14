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
  CsvExportModule,
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
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete Details",
      children: [
        {
          field: "athlete",
          width: 180,
        },
        {
          field: "age",
          width: 90,
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
        },
        {
          columnGroupShow: "open",
          field: "gold",
          width: 100,
        },
        {
          columnGroupShow: "open",
          field: "silver",
          width: 100,
        },
        {
          columnGroupShow: "open",
          field: "bronze",
          width: 100,
        },
      ],
    },
  ]);
  const defaultExcelExportParams = useMemo(() => {
    return {
      freezeRows: (params) => {
        const node = params.node;
        if (node == null) {
          return true;
        }
        return node.rowIndex < 20;
      },
      freezeColumns: (params) => params.column.getColId() !== "sport",
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
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
            <AgGridReact
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();
