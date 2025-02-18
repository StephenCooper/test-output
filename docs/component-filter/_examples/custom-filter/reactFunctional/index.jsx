'use client';
import { useFetchJson } from './useFetchJson';
import React, { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  CustomFilterModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import PersonFilter from "./personFilter";
import "./style.css";
import YearFilter from "./yearFilter";

ModuleRegistry.registerModules([
  CustomFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 150, filter: PersonFilter },
    { field: "year", minWidth: 130, filter: YearFilter },
    { field: "country", minWidth: 150 },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
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
