"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

// specify the data
const rowDataA = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

const rowDataB = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "BMW", model: "M50", price: 60000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(rowDataA);
  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const rowSelection = useMemo(() => {
    return { mode: "singleRow", checkboxes: false, enableClickSelection: true };
  }, []);

  const onRowDataA = useCallback(() => {
    setRowData(rowDataA);
  }, [rowDataA]);

  const onRowDataB = useCallback(() => {
    setRowData(rowDataB);
  }, [rowDataB]);

  const onClearRowData = useCallback(() => {
    // Clear rowData by setting it to an empty array
    setRowData([]);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "5px", minHeight: "30px" }}>
          <button onClick={onRowDataA}>Row Data A</button>
          <button onClick={onRowDataB}>Row Data B</button>
          <button onClick={onClearRowData}>Clear Row Data</button>
        </div>
        <div style={{ flex: "1 1 0px" }}>
          <div style={gridStyle}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              rowSelection={rowSelection}
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
