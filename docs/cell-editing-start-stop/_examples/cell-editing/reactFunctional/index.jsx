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
import { getData } from "./data.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  PinnedRowModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const getPinnedTopData = () => {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
};

const getPinnedBottomData = () => {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "firstName" },
    { field: "lastName" },
    { field: "gender" },
    { field: "age" },
    { field: "mood" },
    { field: "country" },
    { field: "address", minWidth: 550 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 110,
      editable: true,
    };
  }, []);
  const pinnedTopRowData = useMemo(() => {
    return getPinnedTopData();
  }, []);
  const pinnedBottomRowData = useMemo(() => {
    return getPinnedBottomData();
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

  const onBtStopEditing = useCallback(() => {
    gridRef.current.api.stopEditing();
  }, []);

  const onBtStartEditing = useCallback((key, pinned) => {
    gridRef.current.api.setFocusedCell(0, "lastName", pinned);
    gridRef.current.api.startEditingCell({
      rowIndex: 0,
      colKey: "lastName",
      // set to 'top', 'bottom' or undefined
      rowPinned: pinned,
      key: key,
    });
  }, []);

  const onBtNextCell = useCallback(() => {
    gridRef.current.api.tabToNextCell();
  }, []);

  const onBtPreviousCell = useCallback(() => {
    gridRef.current.api.tabToPreviousCell();
  }, []);

  const onBtWhich = useCallback(() => {
    const cellDefs = gridRef.current.api.getEditingCells();
    if (cellDefs.length > 0) {
      const cellDef = cellDefs[0];
      console.log(
        "editing cell is: row = " +
          cellDef.rowIndex +
          ", col = " +
          cellDef.column.getId() +
          ", floating = " +
          cellDef.rowPinned,
      );
    } else {
      console.log("no cells are editing");
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <div style={{ marginBottom: "5px", display: "flex" }}>
            <button onClick={() => onBtStartEditing(undefined)}>
              edit (0)
            </button>
            <button onClick={() => onBtStartEditing("Backspace")}>
              edit (0, Backspace)
            </button>
            <button onClick={() => onBtStartEditing("T")}>edit (0, 'T')</button>
            <button onClick={() => onBtStartEditing(undefined, "top")}>
              edit (0, Top)
            </button>
            <button onClick={() => onBtStartEditing(undefined, "bottom")}>
              edit (0, Bottom)
            </button>
          </div>
          <div style={{ marginBottom: "5px", display: "flex" }}>
            <button onClick={onBtStopEditing}>stop ()</button>
            <button onClick={onBtNextCell}>next ()</button>
            <button onClick={onBtPreviousCell}>previous ()</button>
            <button onClick={onBtWhich}>which ()</button>
          </div>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pinnedTopRowData={pinnedTopRowData}
              pinnedBottomRowData={pinnedBottomRowData}
              onRowEditingStarted={onRowEditingStarted}
              onRowEditingStopped={onRowEditingStopped}
              onCellEditingStarted={onCellEditingStarted}
              onCellEditingStopped={onCellEditingStopped}
            />
          </div>
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
