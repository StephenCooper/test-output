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
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", enableRowGroup: true },
    { field: "year", enableRowGroup: true },
    { field: "athlete", minWidth: 180 },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onPropertyChange = useCallback(() => {
    const prop = document.querySelector("#visibility-behaviour").value;
    if (prop === "true" || prop === "false") {
      gridRef.current.api.setGridOption(
        "suppressGroupChangesColumnVisibility",
        prop === "true",
      );
    } else {
      gridRef.current.api.setGridOption(
        "suppressGroupChangesColumnVisibility",
        prop,
      );
    }
  }, []);

  const resetCols = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", [
      { field: "country", enableRowGroup: true, hide: false },
      { field: "year", enableRowGroup: true, hide: false },
      { field: "athlete", minWidth: 180, hide: false },
      { field: "total", hide: false },
    ]);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>suppressGroupChangesColumnVisibility:</span>
            <select id="visibility-behaviour" onChange={onPropertyChange}>
              <option value="false">false</option>
              <option value="true">true</option>
              <option value="suppressHideOnGroup">"suppressHideOnGroup"</option>
              <option value="suppressShowOnUngroup">
                "suppressShowOnUngroup"
              </option>
            </select>
          </label>
          <button onClick={resetCols}>Reset Column Visibility</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            suppressDragLeaveHidesColumns={true}
            rowGroupPanelShow={"always"}
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
