'use client';
import { useFetchJson } from './useFetchJson';
import React, { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import NumberFloatingFilterComponent from "./numberFloatingFilterComponent";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", filter: false },
    {
      field: "gold",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "gold",
      },
      suppressFloatingFilterButton: true,
    },
    {
      field: "silver",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "silver",
      },
      suppressFloatingFilterButton: true,
    },
    {
      field: "bronze",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "#CD7F32",
      },
      suppressFloatingFilterButton: true,
    },
    {
      field: "total",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "unset",
      },
      suppressFloatingFilterButton: true,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
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
