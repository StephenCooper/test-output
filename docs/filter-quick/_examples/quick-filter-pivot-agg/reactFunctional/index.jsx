"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  QuickFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

let applyBeforePivotOrAgg = false;

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "sport" },
    { field: "year", pivot: true },
    { field: "age" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 250,
    };
  }, []);

  const onApplyBeforePivotOrAgg = useCallback(() => {
    applyBeforePivotOrAgg = !applyBeforePivotOrAgg;
    gridRef.current.api.setGridOption(
      "applyQuickFilterBeforePivotOrAgg",
      applyBeforePivotOrAgg,
    );
    document.querySelector("#applyBeforePivotOrAgg").textContent =
      `Apply ${applyBeforePivotOrAgg ? "After" : "Before"} Pivot/Aggregation`;
  }, [applyBeforePivotOrAgg]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value,
    );
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
          <button
            id="applyBeforePivotOrAgg"
            style={{ marginLeft: "20px" }}
            onClick={onApplyBeforePivotOrAgg}
          >
            Apply Before Pivot/Aggregation
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            pivotMode={true}
          />
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
window.tearDownExample = () => root.unmount();
