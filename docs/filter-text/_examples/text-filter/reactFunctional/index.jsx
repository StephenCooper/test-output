"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function contains(target, lookingFor) {
  return target && target.indexOf(lookingFor) >= 0;
}

const athleteFilterParams = {
  filterOptions: ["contains", "notContains"],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/æ/g, "ae")
      .replace(/ç/g, "c")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/ñ/g, "n")
      .replace(/[òóôõö]/g, "o")
      .replace(/œ/g, "oe")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y");
  },
  debounceMs: 200,
  maxNumConditions: 1,
};

const countryFilterParams = {
  filterOptions: ["contains"],
  textMatcher: ({ value, filterText }) => {
    const aliases = {
      usa: "united states",
      holland: "netherlands",
      niall: "ireland",
      sean: "south africa",
      alberto: "mexico",
      john: "australia",
      xi: "china",
    };
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch || !!contains(value, aliases[filterText || ""]);
  },
  trimInput: true,
  debounceMs: 1000,
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      filterParams: athleteFilterParams,
    },
    {
      field: "country",
      filter: "agTextColumnFilter",
      filterParams: countryFilterParams,
    },
    {
      field: "sport",
      filter: "agTextColumnFilter",
      filterParams: {
        caseSensitive: true,
        defaultOption: "startsWith",
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
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
