"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  SetFilterModule,
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
    { field: "athlete" },
    { field: "countryObject", headerName: "Country" },
    { field: "sportObject", headerName: "Sport" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      floatingFilter: true,
      editable: true,
    };
  }, []);
  const dataTypeDefinitions = useMemo(() => {
    return {
      country: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) =>
          params.newValue == null || params.newValue === ""
            ? null
            : { code: params.newValue },
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.code,
        dataTypeMatcher: (value) => value && !!value.code,
      },
      sport: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) =>
          params.newValue == null || params.newValue === ""
            ? null
            : { name: params.newValue },
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
        dataTypeMatcher: (value) => value && !!value.name,
      },
    };
  }, []);
  const cellSelection = useMemo(() => {
    return { handle: { mode: "fill" } };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          dataTypeDefinitions={dataTypeDefinitions}
          cellSelection={cellSelection}
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
