"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
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
      headerName: "Athlete Details",
      suppressStickyLabel: true,
      children: [
        { field: "athlete", pinned: true, colId: "athlete" },
        { field: "country", colId: "country" },
        { field: "age", colId: "age" },
      ],
    },
    {
      headerName: "Sports Results",
      suppressStickyLabel: true,
      openByDefault: true,
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold", columnGroupShow: "open" },
        { field: "silver", colId: "silver", columnGroupShow: "open" },
        { field: "bronze", colId: "bronze", columnGroupShow: "open" },
        { field: "total", colId: "total", columnGroupShow: "closed" },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 200,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
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
