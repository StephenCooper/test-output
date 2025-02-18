"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TooltipModule,
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
      headerName: "Name & Country",
      headerTooltip: "Name & Country Group",
      children: [{ field: "athlete" }, { field: "country" }],
    },
    {
      headerName: "Sports Results",
      headerTooltip: "Sports Results Group",
      children: [
        { columnGroupShow: "closed", field: "total" },
        { columnGroupShow: "open", field: "gold" },
        { columnGroupShow: "open", field: "silver" },
        { columnGroupShow: "open", field: "bronze" },
      ],
    },
  ]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact rowData={data} loading={loading} columnDefs={columnDefs} />
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
