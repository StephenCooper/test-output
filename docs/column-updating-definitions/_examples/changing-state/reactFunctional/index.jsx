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
  ColumnApiModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const getColumnDefs = () => {
  return [
    { field: "athlete", width: 150, sort: "asc" },
    { field: "age" },
    { field: "country", pinned: "left" },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const defaultColDef = useMemo(() => {
    return {
      width: 100,
      pinned: null,
      sort: null, // important - clears sort if not specified in col def
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState(getColumnDefs());

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtWithState = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", getColumnDefs());
  }, []);

  const onBtRemove = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", []);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtWithState}>Set Columns with State</button>
          <button onClick={onBtRemove}>Remove Columns</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            defaultColDef={defaultColDef}
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
