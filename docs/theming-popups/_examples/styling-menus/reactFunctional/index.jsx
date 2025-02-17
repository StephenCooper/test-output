"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import { ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { useFetchJson } from "./useFetchJson";

// Set a blue background and red shadows for all menus
const myTheme = themeQuartz.withParams({
  menuBackgroundColor: "cornflowerblue",
  menuShadow: { radius: 10, spread: 5, color: "red" },
});

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 170 },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country" },
    { field: "year", filter: "agNumberColumnFilter" },
    { field: "date", filter: "agDateColumnFilter" },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);
  const theme = useMemo(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          theme={theme}
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
