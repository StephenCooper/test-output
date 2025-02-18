"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import CustomHeader from "./customHeader.jsx";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
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
    { field: "athlete", suppressHeaderFilterButton: true, minWidth: 120 },
    {
      field: "age",
      sortable: false,
      headerComponentParams: { menuIcon: "fa-external-link-alt" },
    },
    { field: "country", suppressHeaderFilterButton: true, minWidth: 120 },
    { field: "year", sortable: false },
    { field: "date", suppressHeaderFilterButton: true },
    { field: "sport", sortable: false },
    {
      field: "gold",
      headerComponentParams: { menuIcon: "fa-cog" },
      minWidth: 120,
    },
    { field: "silver", sortable: false },
    { field: "bronze", suppressHeaderFilterButton: true, minWidth: 120 },
    { field: "total", sortable: false },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      headerComponent: CustomHeader,
      headerComponentParams: {
        menuIcon: "fa-filter",
      },
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
window.tearDownExample = () => root.unmount();
