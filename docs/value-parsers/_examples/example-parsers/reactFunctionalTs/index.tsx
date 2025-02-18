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
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  ValueParserParams,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function numberParser(params: ValueParserParams) {
  return Number(params.newValue);
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "Name", field: "simple" },
    { headerName: "Bad Number", field: "numberBad" },
    {
      headerName: "Good Number",
      field: "numberGood",
      valueParser: numberParser,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
      cellDataType: false,
    };
  }, []);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    console.log("data after changes is: ", event.data);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
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
