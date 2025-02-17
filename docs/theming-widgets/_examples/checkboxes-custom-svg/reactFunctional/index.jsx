"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import { ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { useFetchJson } from "./useFetchJson";

const myTheme = themeQuartz.withoutPart("checkboxStyle");

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", hide: true },
    { field: "age", hide: true },
    { field: "country", hide: true },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
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
          sideBar={true}
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
