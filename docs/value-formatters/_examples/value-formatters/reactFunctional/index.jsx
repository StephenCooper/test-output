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
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const bracketsFormatter = (params) => {
  return "(" + params.value + ")";
};

const currencyFormatter = (params) => {
  return "£" + formatNumber(params.value);
};

const formatNumber = (number) => {
  return Math.floor(number).toLocaleString();
};

const createRowData = () => {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(((i + 2) * 173456) % 10000),
      b: Math.floor(((i + 7) * 373456) % 10000),
    });
  }
  return rowData;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(createRowData());
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "£A", field: "a", valueFormatter: currencyFormatter },
    { headerName: "£B", field: "b", valueFormatter: currencyFormatter },
    { headerName: "(A)", field: "a", valueFormatter: bracketsFormatter },
    { headerName: "(B)", field: "b", valueFormatter: bracketsFormatter },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      cellClass: "number-cell",
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
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
