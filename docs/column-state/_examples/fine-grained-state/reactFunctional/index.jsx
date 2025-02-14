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
  createGrid,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef();
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
      width: 150,
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

  const onBtSortAthlete = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [{ colId: "athlete", sort: "asc" }],
    });
  }, []);

  const onBtSortCountryThenSportClearOthers = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "country", sort: "asc", sortIndex: 0 },
        { colId: "sport", sort: "asc", sortIndex: 1 },
      ],
      defaultState: { sort: null },
    });
  }, []);

  const onBtClearAllSorting = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { sort: null },
    });
  }, []);

  const onBtRowGroupCountryThenSport = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "country", rowGroupIndex: 0 },
        { colId: "sport", rowGroupIndex: 1 },
      ],
      defaultState: { rowGroup: false },
    });
  }, []);

  const onBtRemoveCountryRowGroup = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [{ colId: "country", rowGroup: false }],
    });
  }, []);

  const onBtClearAllRowGroups = useCallback(() => {
    gridRef.current.api.applyColumnState({
      defaultState: { rowGroup: false },
    });
  }, []);

  const onBtOrderColsMedalsFirst = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
        { colId: "total" },
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "year" },
        { colId: "date" },
      ],
      applyOrder: true,
    });
  }, []);

  const onBtOrderColsMedalsLast = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "year" },
        { colId: "date" },
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
        { colId: "total" },
      ],
      applyOrder: true,
    });
  }, []);

  const onBtHideMedals = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "gold", hide: true },
        { colId: "silver", hide: true },
        { colId: "bronze", hide: true },
        { colId: "total", hide: true },
      ],
    });
  }, []);

  const onBtShowMedals = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [
        { colId: "gold", hide: false },
        { colId: "silver", hide: false },
        { colId: "bronze", hide: false },
        { colId: "total", hide: false },
      ],
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <table>
            <tbody>
              <tr>
                <td>Sort:</td>
                <td>
                  <button onClick={onBtSortAthlete}>Sort Athlete</button>
                  <button onClick={onBtSortCountryThenSportClearOthers}>
                    Sort Country, then Sport - Clear Others
                  </button>
                  <button onClick={onBtClearAllSorting}>
                    Clear All Sorting
                  </button>
                </td>
              </tr>
              <tr>
                <td>Column Order:</td>
                <td>
                  <button onClick={onBtOrderColsMedalsFirst}>
                    Show Medals First
                  </button>
                  <button onClick={onBtOrderColsMedalsLast}>
                    Show Medals Last
                  </button>
                </td>
              </tr>
              <tr>
                <td>Column Visibility:</td>
                <td>
                  <button onClick={onBtHideMedals}>Hide Medals</button>
                  <button onClick={onBtShowMedals}>Show Medals</button>
                </td>
              </tr>
              <tr>
                <td>Row Group:</td>
                <td>
                  <button onClick={onBtRowGroupCountryThenSport}>
                    Group Country then Sport
                  </button>
                  <button onClick={onBtRemoveCountryRowGroup}>
                    Remove Country
                  </button>
                  <button onClick={onBtClearAllRowGroups}>
                    Clear All Groups
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
