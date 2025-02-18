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
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ScrollApiModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ScrollApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "#",
      colId: "rowNum",
      valueGetter: "node.id",
      width: 80,
      pinned: "left",
    },
    { field: "athlete", width: 150, pinned: "left" },
    { field: "age", width: 90, pinned: "left" },
    { field: "country", width: 150 },
    { field: "year", width: 90 },
    { field: "date", width: 110 },
    { field: "sport", width: 150 },
    { field: "gold", width: 100 },
    { field: "silver", width: 100 },
    { field: "bronze", width: 100 },
    { field: "total", width: 100, pinned: "right" },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const clearPinned = useCallback(() => {
    gridRef.current!.api.applyColumnState({ defaultState: { pinned: null } });
  }, []);

  const resetPinned = useCallback(() => {
    gridRef.current!.api.applyColumnState({
      state: [
        { colId: "rowNum", pinned: "left" },
        { colId: "athlete", pinned: "left" },
        { colId: "age", pinned: "left" },
        { colId: "total", pinned: "right" },
      ],
      defaultState: { pinned: null },
    });
  }, []);

  const pinCountry = useCallback(() => {
    gridRef.current!.api.applyColumnState({
      state: [{ colId: "country", pinned: "left" }],
      defaultState: { pinned: null },
    });
  }, []);

  const jumpToCol = useCallback(() => {
    const value = (document.getElementById("col") as HTMLInputElement).value;
    if (typeof value !== "string" || value === "") {
      return;
    }
    const index = Number(value);
    if (typeof index !== "number" || isNaN(index)) {
      return;
    }
    // it's actually a column the api needs, so look the column up
    const allColumns = gridRef.current!.api.getColumns();
    if (allColumns) {
      const column = allColumns[index];
      if (column) {
        gridRef.current!.api.ensureColumnVisible(column);
      }
    }
  }, []);

  const jumpToRow = useCallback(() => {
    const value = (document.getElementById("row") as HTMLInputElement).value;
    const index = Number(value);
    if (typeof index === "number" && !isNaN(index)) {
      gridRef.current!.api.ensureIndexVisible(index);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <div style={{ padding: "4px" }}>
            <button onClick={clearPinned}>Clear Pinned</button>
            <button onClick={resetPinned}>
              Left = #, Athlete, Age; Right = Total
            </button>
            <button onClick={pinCountry}>Left = Country</button>
          </div>

          <div style={{ padding: "4px" }}>
            Jump to:
            <input
              placeholder="row"
              type="text"
              style={{ width: "40px" }}
              id="row"
              onInput={jumpToRow}
            />
            <input
              placeholder="col"
              type="text"
              style={{ width: "40px" }}
              id="col"
              onInput={jumpToCol}
            />
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
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
