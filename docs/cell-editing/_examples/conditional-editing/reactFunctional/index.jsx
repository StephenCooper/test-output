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
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  NumberEditorModule,
  TextEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let editableYear = 2012;

const isCellEditable = (params) => {
  return params.data.year === editableYear;
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", type: "editableColumn" },
    { field: "age", type: "editableColumn" },
    { field: "year" },
    { field: "country" },
    { field: "sport" },
    { field: "total" },
  ]);
  const columnTypes = useMemo(() => {
    return {
      editableColumn: {
        editable: (params) => {
          return isCellEditable(params);
        },
        cellStyle: (params) => {
          if (isCellEditable(params)) {
            return { backgroundColor: "#2244CC44" };
          }
        },
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const setEditableYear = useCallback((year) => {
    editableYear = year;
    // Redraw to re-apply the new cell style
    gridRef.current.api.redrawRows();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button
            style={{ fontSize: "12px" }}
            onClick={() => setEditableYear(2008)}
          >
            Enable Editing for 2008
          </button>
          <button
            style={{ fontSize: "12px" }}
            onClick={() => setEditableYear(2012)}
          >
            Enable Editing for 2012
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            columnTypes={columnTypes}
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
