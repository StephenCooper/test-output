'use client';
import { useFetchJson } from './useFetchJson';
import React, { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import "./styles.css";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.id",
      },
      {
        field: "athlete",
        minWidth: 170,
      },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ],
    [],
  );

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const defaultColDef = useMemo(
    () => ({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    }),
    [],
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="test-container">
        <div>
          <div className="form-container">
            <label>Input Above</label>
            <input type="text" />
          </div>
        </div>
        <div id="myGrid" style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
          />
        </div>
        <div className="form-container">
          <label>Input Below</label>
          <input type="text" />
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
