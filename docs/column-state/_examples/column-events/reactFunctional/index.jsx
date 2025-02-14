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
  ColumnApiModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 150,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onSortChanged = useCallback((e) => {
    console.log("Event Sort Changed", e);
  }, []);

  const onColumnResized = useCallback((e) => {
    console.log("Event Column Resized", e);
  }, []);

  const onColumnVisible = useCallback((e) => {
    console.log("Event Column Visible", e);
  }, []);

  const onColumnPivotChanged = useCallback((e) => {
    console.log("Event Pivot Changed", e);
  }, []);

  const onColumnRowGroupChanged = useCallback((e) => {
    console.log("Event Row Group Changed", e);
  }, []);

  const onColumnValueChanged = useCallback((e) => {
    console.log("Event Value Changed", e);
  }, []);

  const onColumnMoved = useCallback((e) => {
    console.log("Event Column Moved", e);
  }, []);

  const onColumnPinned = useCallback((e) => {
    console.log("Event Column Pinned", e);
  }, []);

  const onBtSortOn = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "age", sort: "desc" },
        { colId: "athlete", sort: "asc" },
      ],
    });
  }, []);

  const onBtSortOff = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { sort: null },
    });
  }, []);

  const onBtWidthNarrow = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "age", width: 100 },
        { colId: "athlete", width: 100 },
      ],
    });
  }, []);

  const onBtWidthNormal = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "age", width: 200 },
        { colId: "athlete", width: 200 },
      ],
    });
  }, []);

  const onBtHide = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "age", hide: true },
        { colId: "athlete", hide: true },
      ],
    });
  }, []);

  const onBtShow = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { hide: false },
    });
  }, []);

  const onBtPivotOn = useCallback(() => {
    gridRef.current.api.setGridOption("pivotMode", true);
    gridRef.current.api.applyColumnState({
      state: [{ colId: "country", pivot: true }],
    });
  }, []);

  const onBtPivotOff = useCallback(() => {
    gridRef.current.api.setGridOption("pivotMode", false);
    gridRef.current.api.applyColumnState({
      defaultState: { pivot: false },
    });
  }, []);

  const onBtRowGroupOn = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [{ colId: "sport", rowGroup: true }],
    });
  }, []);

  const onBtRowGroupOff = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { rowGroup: false },
    });
  }, []);

  const onBtAggFuncOn = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "gold", aggFunc: "sum" },
        { colId: "silver", aggFunc: "sum" },
        { colId: "bronze", aggFunc: "sum" },
      ],
    });
  }, []);

  const onBtAggFuncOff = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { aggFunc: null },
    });
  }, []);

  const onBtNormalOrder = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
      ],
      applyOrder: true,
    });
  }, []);

  const onBtReverseOrder = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "bronze" },
        { colId: "silver" },
        { colId: "gold" },
      ],
      applyOrder: true,
    });
  }, []);

  const onBtPinnedOn = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "athlete", pinned: "left" },
        { colId: "age", pinned: "right" },
      ],
    });
  }, []);

  const onBtPinnedOff = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { pinned: null },
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div className="test-button-row">
            <div className="test-button-group">
              <button onClick={onBtSortOn}>Sort On</button>
              <br />
              <button onClick={onBtSortOff}>Sort Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtWidthNarrow}>Width Narrow</button>
              <br />
              <button onClick={onBtWidthNormal}>Width Normal</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtHide}>Hide Cols</button>
              <br />
              <button onClick={onBtShow}>Show Cols</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtReverseOrder}>Reverse Medal Order</button>
              <br />
              <button onClick={onBtNormalOrder}>Normal Medal Order</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtRowGroupOn}>Row Group On</button>
              <br />
              <button onClick={onBtRowGroupOff}>Row Group Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtAggFuncOn}>Agg Func On</button>
              <br />
              <button onClick={onBtAggFuncOff}>Agg Func Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtPivotOn}>Pivot On</button>
              <br />
              <button onClick={onBtPivotOff}>Pivot Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtPinnedOn}>Pinned On</button>
              <br />
              <button onClick={onBtPinnedOff}>Pinned Off</button>
            </div>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onSortChanged={onSortChanged}
            onColumnResized={onColumnResized}
            onColumnVisible={onColumnVisible}
            onColumnPivotChanged={onColumnPivotChanged}
            onColumnRowGroupChanged={onColumnRowGroupChanged}
            onColumnValueChanged={onColumnValueChanged}
            onColumnMoved={onColumnMoved}
            onColumnPinned={onColumnPinned}
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
