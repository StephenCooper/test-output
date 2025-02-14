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
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const hashValueGetter = (params) => {
  return params.node ? Number(params.node.id) : null;
};

const abValueGetter = (params) => {
  return params.data.a + params.data.b;
};

const a1000ValueGetter = (params) => {
  return params.data.a * 1000;
};

const b137ValueGetter = (params) => {
  return params.data.b * 137;
};

const randomValueGetter = () => {
  return Math.floor(Math.random() * 1000);
};

const chainValueGetter = (params) => {
  return params.getValue("a&b") * 1000;
};

const constValueGetter = () => {
  return 99999;
};

const createRowData = () => {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(i % 4),
      b: Math.floor(i % 7),
    });
  }
  return rowData;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(createRowData());
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID #",
      maxWidth: 100,
      valueGetter: hashValueGetter,
    },
    { field: "a" },
    { field: "b" },
    {
      headerName: "A + B",
      colId: "a&b",
      valueGetter: abValueGetter,
    },
    {
      headerName: "A * 1000",
      minWidth: 95,
      valueGetter: a1000ValueGetter,
    },
    {
      headerName: "B * 137",
      minWidth: 90,
      valueGetter: b137ValueGetter,
    },
    {
      headerName: "Random",
      minWidth: 90,
      valueGetter: randomValueGetter,
    },
    {
      headerName: "Chain",
      valueGetter: chainValueGetter,
    },
    {
      headerName: "Const",
      minWidth: 85,
      valueGetter: constValueGetter,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 75,
      // cellClass: 'number-cell'
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
