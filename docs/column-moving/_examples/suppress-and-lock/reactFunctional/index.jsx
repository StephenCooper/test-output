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
import "./style.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      suppressMovable: true,
      cellClass: "suppress-movable-col",
    },
    { field: "age", lockPosition: "left", cellClass: "locked-col" },
    { field: "country" },
    { field: "year" },
    { field: "total", lockPosition: "right", cellClass: "locked-col" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      lockPinned: true, // Dont allow pinning for this example
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div className="legend-bar">
          <span className="legend-box locked-col"></span> Position Locked Column
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="legend-box suppress-movable-col"></span> Suppress
          Movable Column
        </div>

        <div style={gridStyle}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressDragLeaveHidesColumns={true}
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
