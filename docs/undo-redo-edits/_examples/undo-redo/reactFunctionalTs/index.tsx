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
import "./styles.css";
import {
  CellSelectionOptions,
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  ModuleRegistry,
  RedoEndedEvent,
  RedoStartedEvent,
  TextEditorModule,
  UndoEndedEvent,
  UndoRedoEditModule,
  UndoStartedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  UndoRedoEditModule,
  TextEditorModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ClipboardModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

function disable(id: string, disabled: boolean) {
  (document.querySelector(id) as any).disabled = disabled;
}

function setValue(id: string, value: number) {
  (document.querySelector(id) as any).value = value;
}

function getRows() {
  return Array.apply(null, Array(100)).map(function (_, i) {
    return {
      a: "a-" + i,
      b: "b-" + i,
      c: "c-" + i,
      d: "d-" + i,
      e: "e-" + i,
      f: "f-" + i,
      g: "g-" + i,
      h: "h-" + i,
    };
  });
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getRows());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
    { field: "g" },
    { field: "h" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
      enableCellChangeFlash: true,
    };
  }, []);
  const cellSelection = useMemo<boolean | CellSelectionOptions>(() => {
    return {
      handle: {
        mode: "fill",
      },
    };
  }, []);

  const onFirstDataRendered = useCallback(() => {
    setValue("#undoInput", 0);
    disable("#undoInput", true);
    disable("#undoBtn", true);
    setValue("#redoInput", 0);
    disable("#redoInput", true);
    disable("#redoBtn", true);
  }, []);

  const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
    console.log("cellValueChanged", params);
    const undoSize = params.api.getCurrentUndoSize();
    setValue("#undoInput", undoSize);
    disable("#undoBtn", undoSize < 1);
    const redoSize = params.api.getCurrentRedoSize();
    setValue("#redoInput", redoSize);
    disable("#redoBtn", redoSize < 1);
  }, []);

  const onUndoStarted = useCallback((event: UndoStartedEvent) => {
    console.log("undoStarted", event);
  }, []);

  const onUndoEnded = useCallback((event: UndoEndedEvent) => {
    console.log("undoEnded", event);
  }, []);

  const onRedoStarted = useCallback((event: RedoStartedEvent) => {
    console.log("redoStarted", event);
  }, []);

  const onRedoEnded = useCallback((event: RedoEndedEvent) => {
    console.log("redoEnded", event);
  }, []);

  const undo = useCallback(() => {
    gridRef.current!.api.undoCellEditing();
  }, []);

  const redo = useCallback(() => {
    gridRef.current!.api.redoCellEditing();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <span className="button-group">
            <label>Available Undo's</label>
            <input id="undoInput" className="undo-redo-input" />
            <label>Available Redo's</label>
            <input id="redoInput" className="undo-redo-input" />
            <button id="undoBtn" className="undo-btn" onClick={undo}>
              Undo
            </button>
            <button id="redoBtn" className="redo-btn" onClick={redo}>
              Redo
            </button>
          </span>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={cellSelection}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={5}
            onFirstDataRendered={onFirstDataRendered}
            onCellValueChanged={onCellValueChanged}
            onUndoStarted={onUndoStarted}
            onUndoEnded={onUndoEnded}
            onRedoStarted={onRedoStarted}
            onRedoEnded={onRedoEnded}
          />
        </div>
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
