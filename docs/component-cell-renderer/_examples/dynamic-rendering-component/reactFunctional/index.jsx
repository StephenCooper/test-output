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
import GenderRenderer from "./genderRenderer.jsx";
import MoodRenderer from "./moodRenderer.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    { value: 14, type: "age" },
    { value: "Female", type: "gender" },
    { value: "Happy", type: "mood" },
    { value: 21, type: "age" },
    { value: "Male", type: "gender" },
    { value: "Sad", type: "mood" },
  ]);
  const [columnDefs, setColumnDefs] = useState([
    { field: "value" },
    {
      headerName: "Rendered Value",
      field: "value",
      cellRendererSelector: (params) => {
        const moodDetails = {
          component: MoodRenderer,
        };
        const genderDetails = {
          component: GenderRenderer,
          params: { values: ["Male", "Female"] },
        };
        if (params.data) {
          if (params.data.type === "gender") return genderDetails;
          else if (params.data.type === "mood") return moodDetails;
        }
        return undefined;
      },
    },
    { field: "type" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      cellDataType: false,
    };
  }, []);

  const onRowEditingStarted = useCallback((event) => {
    console.log("never called - not doing row editing");
  }, []);

  const onRowEditingStopped = useCallback((event) => {
    console.log("never called - not doing row editing");
  }, []);

  const onCellEditingStarted = useCallback((event) => {
    console.log("cellEditingStarted");
  }, []);

  const onCellEditingStopped = useCallback((event) => {
    console.log("cellEditingStopped");
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onRowEditingStarted={onRowEditingStarted}
          onRowEditingStopped={onRowEditingStopped}
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingStopped}
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
