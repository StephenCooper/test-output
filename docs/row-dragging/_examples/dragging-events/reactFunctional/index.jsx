"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", rowDrag: true },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 170,
      filter: true,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onRowDragEnter = useCallback((e) => {
    console.log("onRowDragEnter", e);
  }, []);

  const onRowDragEnd = useCallback((e) => {
    console.log("onRowDragEnd", e);
  }, []);

  const onRowDragMove = useCallback((e) => {
    console.log("onRowDragMove", e);
  }, []);

  const onRowDragLeave = useCallback((e) => {
    console.log("onRowDragLeave", e);
  }, []);

  const onRowDragCancel = useCallback((e) => {
    console.log("onRowDragCancel", e);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div
          className="example-header"
          style={{ backgroundColor: "#ccaa22a9" }}
        >
          Rows in this example do not move, only events are fired
        </div>

        <div style={gridStyle}>
          <AgGridReact
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowDragEnter={onRowDragEnter}
            onRowDragEnd={onRowDragEnd}
            onRowDragMove={onRowDragMove}
            onRowDragLeave={onRowDragLeave}
            onRowDragCancel={onRowDragCancel}
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
