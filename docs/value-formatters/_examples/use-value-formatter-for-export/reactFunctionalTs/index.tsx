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
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  ValueParserParams,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

function currencyFormatter(params: ValueFormatterParams) {
  return params.value == null ? "" : "£" + params.value;
}

function currencyParser(params: ValueParserParams) {
  let value = params.newValue;
  if (value == null || value === "") {
    return null;
  }
  value = String(value);
  if (value.startsWith("£")) {
    value = value.slice(1);
  }
  return parseFloat(value);
}

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(((i + 2) * 173456) % 10000),
      b: Math.floor(((i + 7) * 373456) % 10000),
    });
  }
  return rowData;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(createRowData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "£A",
      field: "a",
      valueFormatter: currencyFormatter,
      valueParser: currencyParser,
    },
    {
      headerName: "£B",
      field: "b",
      valueFormatter: currencyFormatter,
      valueParser: currencyParser,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellDataType: false,
      editable: true,
    };
  }, []);
  const cellSelection = useMemo<boolean | CellSelectionOptions>(() => {
    return {
      handle: {
        mode: "fill",
      },
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={cellSelection}
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
