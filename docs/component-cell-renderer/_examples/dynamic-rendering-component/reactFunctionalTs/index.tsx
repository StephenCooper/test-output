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
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
  ModuleRegistry,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import GenderRenderer from "./genderRenderer.tsx";
import MoodRenderer from "./moodRenderer.tsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IRow {
  value: number | string;
  type: "age" | "gender" | "mood";
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IRow[]>([
    { value: 14, type: "age" },
    { value: "Female", type: "gender" },
    { value: "Happy", type: "mood" },
    { value: 21, type: "age" },
    { value: "Male", type: "gender" },
    { value: "Sad", type: "mood" },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "value" },
    {
      headerName: "Rendered Value",
      field: "value",
      cellRendererSelector: (params: ICellRendererParams<IRow>) => {
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
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      cellDataType: false,
    };
  }, []);

  const onRowEditingStarted = useCallback(
    (event: RowEditingStartedEvent<IRow>) => {
      console.log("never called - not doing row editing");
    },
    [],
  );

  const onRowEditingStopped = useCallback(
    (event: RowEditingStoppedEvent<IRow>) => {
      console.log("never called - not doing row editing");
    },
    [],
  );

  const onCellEditingStarted = useCallback(
    (event: CellEditingStartedEvent<IRow>) => {
      console.log("cellEditingStarted");
    },
    [],
  );

  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent<IRow>) => {
      console.log("cellEditingStopped");
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IRow>
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();
