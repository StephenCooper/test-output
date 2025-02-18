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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
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

let applyBeforePivotOrAgg = false;

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "sport" },
    { field: "year", pivot: true },
    { field: "age" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 250,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: any[]) => setRowData(data));
  }, []);

  const onApplyBeforePivotOrAgg = useCallback(() => {
    applyBeforePivotOrAgg = !applyBeforePivotOrAgg;
    gridRef.current!.api.setGridOption(
      "applyQuickFilterBeforePivotOrAgg",
      applyBeforePivotOrAgg,
    );
    document.querySelector("#applyBeforePivotOrAgg")!.textContent =
      `Apply ${applyBeforePivotOrAgg ? "After" : "Before"} Pivot/Aggregation`;
  }, [applyBeforePivotOrAgg]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
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
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            pivotMode={true}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();
