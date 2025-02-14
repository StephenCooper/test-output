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
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let savedMiniFilterText = "";

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", filter: "agSetColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));

    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  const getMiniFilterText = useCallback(() => {
    gridRef.current.api
      .getColumnFilterInstance("athlete")
      .then((athleteFilter) => {
        console.log(athleteFilter.getMiniFilter());
      });
  }, []);

  const saveMiniFilterText = useCallback(() => {
    gridRef.current.api
      .getColumnFilterInstance("athlete")
      .then((athleteFilter) => {
        savedMiniFilterText = athleteFilter.getMiniFilter();
      });
  }, []);

  const restoreMiniFilterText = useCallback(() => {
    gridRef.current.api
      .getColumnFilterInstance("athlete")
      .then((athleteFilter) => {
        athleteFilter.setMiniFilter(savedMiniFilterText);
      });
  }, [savedMiniFilterText]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <button onClick={getMiniFilterText}>Get Mini Filter Text</button>
          <button onClick={saveMiniFilterText}>Save Mini Filter Text</button>
          <button onClick={restoreMiniFilterText}>
            Restore Mini Filter Text
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
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
