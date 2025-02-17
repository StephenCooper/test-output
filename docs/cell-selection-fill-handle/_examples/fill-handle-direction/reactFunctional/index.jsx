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
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/small-olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
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
      editable: true,
      cellDataType: false,
    };
  }, []);
  const cellSelection = useMemo(() => {
    return {
      handle: {
        mode: "fill",
        direction: "x",
      },
    };
  }, []);

  const fillHandleAxis = useCallback((direction) => {
    const buttons = Array.prototype.slice.call(
      document.querySelectorAll(".ag-fill-direction"),
    );
    const button = document.querySelector(".ag-fill-direction." + direction);
    buttons.forEach((btn) => {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");
    gridRef.current.api.setGridOption("cellSelection", {
      handle: {
        mode: "fill",
        direction,
      },
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <label>Axis: </label>
          <button
            className="ag-fill-direction xy"
            onClick={() => fillHandleAxis("xy")}
          >
            xy
          </button>
          <button
            className="ag-fill-direction x selected"
            onClick={() => fillHandleAxis("x")}
          >
            x only
          </button>
          <button
            className="ag-fill-direction y"
            onClick={() => fillHandleAxis("y")}
          >
            y only
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={cellSelection}
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
