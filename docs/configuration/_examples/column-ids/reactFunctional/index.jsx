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
import {
  ClientSideRowModelModule,
  ColumnApiModule,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const createRowData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      height: Math.floor(Math.random() * 100),
      width: Math.floor(Math.random() * 100),
      depth: Math.floor(Math.random() * 100),
    });
  }
  return data;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(createRowData());
  const [columnDefs, setColumnDefs] = useState([
    // colId will be 'height',
    { headerName: "Col 1", field: "height" },
    // colId will be 'firstWidth',
    { headerName: "Col 2", colId: "firstWidth", field: "width" },
    // colId will be 'secondWidth'
    { headerName: "Col 3", colId: "secondWidth", field: "width" },
    // no colId, no field, so grid generated ID
    { headerName: "Col 4", valueGetter: "data.width" },
    { headerName: "Col 5", valueGetter: "data.width" },
  ]);

  const onGridReady = useCallback((params) => {
    const cols = params.api.getColumns();
    cols.forEach((col) => {
      const colDef = col.getColDef();
      console.log(
        colDef.headerName + ", Column ID = " + col.getId(),
        JSON.stringify(colDef),
      );
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div style={gridStyle}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          />
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
