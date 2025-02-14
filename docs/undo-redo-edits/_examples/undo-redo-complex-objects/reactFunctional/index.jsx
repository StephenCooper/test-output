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
  ClientSideRowModelModule,
  HighlightChangesModule,
  ModuleRegistry,
  TextEditorModule,
  UndoRedoEditModule,
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

const createValueA = (value, data) => {
  return value == null
    ? null
    : {
        actualValueA: value,
        anotherPropertyA: data.anotherPropertyA,
      };
};

const valueFormatterA = (params) => {
  // Convert complex object to string
  return params.value ? params.value.actualValueA : "";
};

const valueGetterA = (params) => {
  // Create complex object from underlying data
  return createValueA(params.data[params.colDef.field], params.data);
};

const valueParserA = (params) => {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterA`). `newValue` is string.
  // We have access to `data` (as well as `oldValue`) to retrieve any other properties we need to recreate the complex object.
  // For undo/redo to work, we need immutable data, so can't mutate `oldValue`
  return createValueA(params.newValue, params.data);
};

const valueSetterA = (params) => {
  // Update data from complex object (reverse of `valueGetterA`)
  params.data[params.colDef.field] = params.newValue
    ? params.newValue.actualValueA
    : null;
  return true;
};

const equalsA = (valueA, valueB) => {
  // Used to detect whether cell value has changed for refreshing. Needed as `valueGetter` returns different references.
  return (
    (valueA == null && valueB == null) ||
    (valueA != null &&
      valueB != null &&
      valueA.actualValueA === valueB.actualValueA)
  );
};

const createValueB = (value, data) => {
  return value == null
    ? null
    : {
        actualValueB: value,
        anotherPropertyB: data.anotherPropertyB,
      };
};

const valueFormatterB = (params) => {
  // Convert complex object to string
  return params.value ? params.value.actualValueB : "";
};

const valueParserB = (params) => {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterB`). `newValue` is string
  return createValueB(params.newValue, params.data);
};

const disable = (id, disabled) => {
  document.querySelector(id).disabled = disabled;
};

const setValue = (id, value) => {
  document.querySelector(id).value = value;
};

const getRows = () => {
  return Array.apply(null, Array(100)).map(function (_, i) {
    return {
      a: "a-" + i,
      b: {
        actualValueB: "b-" + i,
        anotherPropertyB: "b",
      },
      anotherPropertyA: "a",
    };
  });
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getRows());
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "a",
      valueFormatter: valueFormatterA,
      valueGetter: valueGetterA,
      valueParser: valueParserA,
      valueSetter: valueSetterA,
      equals: equalsA,
      cellDataType: "object",
    },
    {
      field: "b",
      valueFormatter: valueFormatterB,
      valueParser: valueParserB,
      cellDataType: "object",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      enableCellChangeFlash: true,
    };
  }, []);
  const cellSelection = useMemo(() => {
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

  const onCellValueChanged = useCallback((params) => {
    const undoSize = params.api.getCurrentUndoSize();
    setValue("#undoInput", undoSize);
    disable("#undoBtn", undoSize < 1);
    const redoSize = params.api.getCurrentRedoSize();
    setValue("#redoInput", redoSize);
    disable("#redoBtn", redoSize < 1);
  }, []);

  const undo = useCallback(() => {
    gridRef.current.api.undoCellEditing();
  }, []);

  const redo = useCallback(() => {
    gridRef.current.api.redoCellEditing();
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
          />
        </div>
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
