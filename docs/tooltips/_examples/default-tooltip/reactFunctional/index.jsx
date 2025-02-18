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
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete",
      field: "athlete",
      tooltipComponentParams: { color: "#55AA77" },
      tooltipField: "country",
      headerTooltip: "Tooltip for Athlete Column Header",
    },
    {
      field: "age",
      tooltipValueGetter: (p) =>
        "Create any fixed message, e.g. This is the Athlete’s Age ",
      headerTooltip: "Tooltip for Age Column Header",
    },
    {
      field: "year",
      tooltipValueGetter: (p) =>
        "This is a dynamic tooltip using the value of " + p.value,
      headerTooltip: "Tooltip for Year Column Header",
    },
    {
      field: "sport",
      tooltipValueGetter: () => "Tooltip text about Sport should go here",
      headerTooltip: "Tooltip for Sport Column Header",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableBrowserTooltips={true}
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
