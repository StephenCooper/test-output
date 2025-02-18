"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  DateEditorModule,
  DateFilterModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  NumberFilterModule,
  DateEditorModule,
  DateFilterModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
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
    { field: "age" },
    { field: "date" },
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
      dateString: {
        baseDataType: "dateString",
        extendsDataType: "dateString",
        valueParser: (params) =>
          params.newValue != null &&
          params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
            ? params.newValue
            : null,
        valueFormatter: (params) => (params.value == null ? "" : params.value),
        dataTypeMatcher: (value) =>
          typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
        dateParser: (value) => {
          if (value == null || value === "") {
            return undefined;
          }
          const dateParts = value.split("/");
          return dateParts.length === 3
            ? new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0]),
              )
            : undefined;
        },
        dateFormatter: (value) => {
          if (value == null) {
            return undefined;
          }
          const date = String(value.getDate());
          const month = String(value.getMonth() + 1);
          return `${date.length === 1 ? "0" + date : date}/${month.length === 1 ? "0" + month : month}/${value.getFullYear()}`;
        },
      },
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
          dataTypeDefinitions={dataTypeDefinitions}
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
