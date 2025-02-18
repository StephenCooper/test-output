"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  RowGroupingModule,
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
    { field: "country", rowGroup: true },
    { field: "athlete" },
    { field: "year" },
    { field: "sport" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const groupRowRendererParams = useMemo(() => {
    return {
      suppressCount: true,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "singleRow",
      checkboxLocation: "autoGroupColumn",
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
          groupRowRendererParams={groupRowRendererParams}
          rowSelection={rowSelection}
          groupDisplayType={"groupRows"}
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
