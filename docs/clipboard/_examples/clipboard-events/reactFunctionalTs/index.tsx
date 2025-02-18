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
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CutEndEvent,
  CutStartEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  PasteEndEvent,
  PasteStartEvent,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
    console.log("Callback onCellValueChanged:", params);
  }, []);

  const onCutStart = useCallback((params: CutStartEvent) => {
    console.log("Callback onCutStart:", params);
  }, []);

  const onCutEnd = useCallback((params: CutEndEvent) => {
    console.log("Callback onCutEnd:", params);
  }, []);

  const onPasteStart = useCallback((params: PasteStartEvent) => {
    console.log("Callback onPasteStart:", params);
  }, []);

  const onPasteEnd = useCallback((params: PasteEndEvent) => {
    console.log("Callback onPasteEnd:", params);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={true}
          onCellValueChanged={onCellValueChanged}
          onCutStart={onCutStart}
          onCutEnd={onCutEnd}
          onPasteStart={onPasteStart}
          onPasteEnd={onPasteEnd}
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
