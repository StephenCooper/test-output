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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ISelectCellEditorParams,
  ModuleRegistry,
  SelectEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SelectEditorModule,
  ValidationModule /* Development Only */,
]);

const languages = ["English", "Spanish", "French", "Portuguese", "(other)"];

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(
    new Array(100)
      .fill(null)
      .map(() => ({ language: languages[getRandomNumber(0, 4)] })),
  );
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Select Editor",
      field: "language",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: languages,
        valueListGap: 10,
      } as ISelectCellEditorParams,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 200,
      editable: true,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
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
