"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import CustomHeaderGroup from "./customHeaderGroup.jsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete Details",
      headerGroupComponent: CustomHeaderGroup,
      children: [
        { field: "athlete", width: 150 },
        { field: "age", width: 90, columnGroupShow: "open" },
        {
          field: "country",
          width: 120,
          columnGroupShow: "open",
        },
      ],
    },
    {
      headerName: "Medal details",
      headerGroupComponent: CustomHeaderGroup,
      children: [
        { field: "year", width: 90 },
        { field: "date", width: 110 },
        {
          field: "sport",
          width: 110,
          columnGroupShow: "open",
        },
        {
          field: "gold",
          width: 100,
          columnGroupShow: "open",
        },
        {
          field: "silver",
          width: 100,
          columnGroupShow: "open",
        },
        {
          field: "bronze",
          width: 100,
          columnGroupShow: "open",
        },
        {
          field: "total",
          width: 100,
          columnGroupShow: "open",
        },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 100,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
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
