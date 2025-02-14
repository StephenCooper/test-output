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
  CellSelectionOptions,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ProcessDataFromClipboardParams,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      minWidth: 120,
      flex: 1,
      cellClassRules: {
        "cell-green": 'value.startsWith("Green")',
        "cell-blue": 'value.startsWith("Blue")',
        "cell-red": 'value.startsWith("Red")',
        "cell-yellow": 'value.startsWith("Yellow")',
      },
    };
  }, []);

  const processDataFromClipboard = useCallback(
    (params: ProcessDataFromClipboardParams): string[][] | null => {
      let containsRed;
      let containsYellow;
      const data = params.data;
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
          const value = row[j];
          if (value) {
            if (value.startsWith("Red")) {
              containsRed = true;
            } else if (value.startsWith("Yellow")) {
              containsYellow = true;
            }
          }
        }
      }
      if (containsRed) {
        // replace the paste request with another
        return [
          ["Custom 1", "Custom 2"],
          ["Custom 3", "Custom 4"],
        ];
      }
      if (containsYellow) {
        // cancels the paste
        return null;
      }
      return data;
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          cellSelection={true}
          defaultColDef={defaultColDef}
          processDataFromClipboard={processDataFromClipboard}
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
