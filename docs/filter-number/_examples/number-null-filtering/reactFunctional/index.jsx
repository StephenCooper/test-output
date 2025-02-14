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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const originalColumnDefs = [
  { field: "athlete" },
  {
    field: "age",
    maxWidth: 120,
    filter: "agNumberColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    },
  },
  {
    headerName: "Description",
    valueGetter: (params) => `Age is ${params.data.age}`,
    minWidth: 340,
  },
];

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    {
      athlete: "Alberto Gutierrez",
      age: 36,
    },
    {
      athlete: "Niall Crosby",
      age: 40,
    },
    {
      athlete: "Sean Landsman",
      age: null,
    },
    {
      athlete: "Robert Clarke",
      age: undefined,
    },
  ]);
  const [columnDefs, setColumnDefs] = useState(originalColumnDefs);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const updateParams = useCallback(
    (toChange) => {
      const value = document.getElementById(`checkbox${toChange}`).checked;
      originalColumnDefs[1].filterParams[`includeBlanksIn${toChange}`] = value;
      gridRef.current.api.setGridOption("columnDefs", originalColumnDefs);
    },
    [originalColumnDefs],
  );

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div className="test-label">
            Include NULL
            <br />
            in age:
          </div>
          <label>
            <input
              type="checkbox"
              id="checkboxEquals"
              onChange={() => updateParams("Equals")}
            />
            &nbsp;equals
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxNotEqual"
              onChange={() => updateParams("NotEqual")}
            />
            &nbsp;notEqual
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxLessThan"
              onChange={() => updateParams("LessThan")}
            />
            &nbsp;lessThan
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxGreaterThan"
              onChange={() => updateParams("GreaterThan")}
            />
            &nbsp;greaterThan
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxRange"
              onChange={() => updateParams("Range")}
            />
            &nbsp;inRange
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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
