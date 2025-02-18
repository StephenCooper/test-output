"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete (locked as pinned)",
      field: "athlete",
      width: 240,
      pinned: "left",
      lockPinned: true,
      cellClass: "lock-pinned",
    },
    {
      headerName: "Age (locked as not pinnable)",
      field: "age",
      width: 260,
      lockPinned: true,
      cellClass: "lock-pinned",
    },
    { field: "country", width: 150 },
    { field: "year", width: 90 },
    { field: "date", width: 150 },
    { field: "sport", width: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <span className="legend-box lock-pinned"></span> Locked Column
        </div>

        <div style={gridStyle}>
          <AgGridReact
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
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
