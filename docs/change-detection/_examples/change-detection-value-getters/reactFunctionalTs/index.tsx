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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 20; i++) {
    rowData.push({
      group: i < 5 ? "A" : "B",
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return rowData;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getRowData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "a", type: "valueColumn" },
    { field: "b", type: "valueColumn" },
    { field: "c", type: "valueColumn" },
    { field: "d", type: "valueColumn" },
    { field: "e", type: "valueColumn" },
    { field: "f", type: "valueColumn" },
    {
      headerName: "Total",
      valueGetter: "data.a + data.b + data.c + data.d + data.e + data.f",
      editable: false,
      cellClass: "total-col",
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      enableCellChangeFlash: true,
    };
  }, []);
  const columnTypes = useMemo<{
    [key: string]: ColTypeDef;
  }>(() => {
    return {
      valueColumn: {
        minWidth: 90,
        editable: true,
        valueParser: "Number(newValue)",
        filter: "agNumberColumnFilter",
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
          columnTypes={columnTypes}
          groupDefaultExpanded={1}
          suppressAggFuncInHeader={true}
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
