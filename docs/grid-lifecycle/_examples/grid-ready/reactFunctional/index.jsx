'use client';
import React, {
  StrictMode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ColumnApiModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import { getData } from "./data";
import "./styles.css";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const [gridKey, setGridKey] = useState(`grid-key-${Math.random()}`);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());

  const [columnDefs, setColumnDefs] = useState([
    { field: "name", headerName: "Athlete", width: 250 },
    { field: "person.country", headerName: "Country" },
    { field: "person.age", headerName: "Age" },
    { field: "medals.gold", headerName: "Gold Medals" },
    { field: "medals.silver", headerName: "Silver Medals" },
    { field: "medals.bronze", headerName: "Bronze Medals" },
  ]);

  const onGridReady = useCallback((params) => {
    const checkbox = document.querySelector("#pinFirstColumnOnLoad");
    const shouldPinFirstColumn = checkbox && checkbox.checked;
    if (shouldPinFirstColumn) {
      params.api.applyColumnState({
        state: [{ colId: "name", pinned: "left" }],
      });
    }
  }, []);

  const reloadGrid = useCallback(() => {
    // Trigger re-load by assigning a new key to the Grid React component
    setGridKey(`grid-key-${Math.random()}`);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div style={{ marginBottom: "1rem" }}>
            <input type="checkbox" id="pinFirstColumnOnLoad" />
            <label htmlFor="pinFirstColumnOnLoad">
              Pin first column on load
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <button id="reloadGridButton" onClick={reloadGrid}>
              Reload Grid
            </button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            key={gridKey}
            ref={gridRef}
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
