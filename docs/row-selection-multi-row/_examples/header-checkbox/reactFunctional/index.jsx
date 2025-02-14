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
  PaginationModule,
  QuickFilterModule,
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  PaginationModule,
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Athlete", field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      selectAll: "all",
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => params.api.setGridOption("rowData", data));
  }, []);

  const onQuickFilterChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.querySelector("#quickFilter")?.value,
    );
  }, []);

  const updateSelectAllMode = useCallback(() => {
    const selectAll =
      document.querySelector("#select-all-mode")?.value ?? "all";
    gridRef.current.api.setGridOption("rowSelection", {
      mode: "multiRow",
      selectAll: selectAll,
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>
            <span>Select All Mode: </span>
            <select id="select-all-mode" onChange={updateSelectAllMode}>
              <option value="all">all</option>
              <option value="filtered">filtered</option>
              <option value="currentPage">currentPage</option>
            </select>
          </label>
          <label>
            <span>Filter: </span>
            <input
              type="text"
              onInput={onQuickFilterChanged}
              id="quickFilter"
              placeholder="quick filter..."
            />
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationAutoPageSize={true}
            rowSelection={rowSelection}
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
