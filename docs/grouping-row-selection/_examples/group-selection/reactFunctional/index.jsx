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
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  RowSelectionModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getGroupSelectsValue = () => {
  return document.querySelector("#input-group-selection-mode")?.value ?? "self";
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Athlete",
      field: "athlete",
      minWidth: 250,
      cellRenderer: "agGroupCellRenderer",
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "self",
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onSelectionModeChange = useCallback(() => {
    gridRef.current.api.setGridOption("rowSelection", {
      mode: "multiRow",
      groupSelects: getGroupSelectsValue(),
    });
  }, []);

  const onQuickFilterChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.querySelector("#input-quick-filter")?.value,
    );
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>Group selects:</span>
            <select
              id="input-group-selection-mode"
              onChange={onSelectionModeChange}
            >
              <option value="self">self</option>
              <option value="descendants">descendants</option>
              <option value="filteredDescendants">filteredDescendants</option>
            </select>
          </label>

          <label>
            <span>Quick Filter:</span>
            <input
              type="text"
              id="input-quick-filter"
              onInput={onQuickFilterChanged}
            />
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowSelection={rowSelection}
            suppressAggFuncInHeader={true}
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
