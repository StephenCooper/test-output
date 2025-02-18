'use client';
import { useFetchJson } from './useFetchJson';
import React, { StrictMode, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextEditorModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import AthleteCellRenderer from "./athleteCellRenderer";
import "./styles.css";

ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  TooltipModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", width: 120, cellRenderer: AthleteCellRenderer },
    { field: "country", width: 150 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
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
