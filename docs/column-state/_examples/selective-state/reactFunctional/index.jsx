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
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  ColumnApiModule,
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
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 100,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);
  const sideBar = useMemo(() => {
    return {
      toolPanels: ["columns"],
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtSaveSortState = useCallback(() => {
    const allState = gridRef.current.api.getColumnState();
    const sortState = allState.map((state) => ({
      colId: state.colId,
      sort: state.sort,
      sortIndex: state.sortIndex,
    }));
    window.sortState = sortState;
    console.log("sort state saved", sortState);
  }, []);

  const onBtRestoreSortState = useCallback(() => {
    if (!window.sortState) {
      console.log("no sort state to restore, you must save sort state first");
      return;
    }
    gridRef.current.api.applyColumnState({
      state: window.sortState,
    });
    console.log("sort state restored");
  }, [window]);

  const onBtSaveOrderAndVisibilityState = useCallback(() => {
    const allState = gridRef.current.api.getColumnState();
    const orderAndVisibilityState = allState.map((state) => ({
      colId: state.colId,
      hide: state.hide,
    }));
    window.orderAndVisibilityState = orderAndVisibilityState;
    console.log("order and visibility state saved", orderAndVisibilityState);
  }, []);

  const onBtRestoreOrderAndVisibilityState = useCallback(() => {
    if (!window.orderAndVisibilityState) {
      console.log(
        "no order and visibility state to restore by, you must save order and visibility state first",
      );
      return;
    }
    gridRef.current.api.applyColumnState({
      state: window.orderAndVisibilityState,
      applyOrder: true,
    });
    console.log("column state restored");
  }, [window]);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div className="example-section">
            <button onClick={onBtSaveSortState}>Save Sort</button>
            <button onClick={onBtRestoreSortState}>Restore Sort</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={onBtSaveOrderAndVisibilityState}>
              Save Order &amp; Visibility
            </button>
            <button onClick={onBtRestoreOrderAndVisibilityState}>
              Restore Order &amp; Visibility
            </button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={sideBar}
            rowGroupPanelShow={"always"}
            pivotPanelShow={"always"}
            onGridReady={onGridReady}
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
