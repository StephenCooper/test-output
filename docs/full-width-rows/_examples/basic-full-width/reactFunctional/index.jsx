"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColumnApiModule,
  ModuleRegistry,
  PinnedRowModule,
  ValidationModule,
} from "ag-grid-community";
import FullWidthCellRenderer from "./fullWidthCellRenderer.jsx";
ModuleRegistry.registerModules([
  ColumnApiModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getColumnDefs() {
  const columnDefs = [];
  alphabet().forEach((letter) => {
    const colDef = {
      headerName: letter,
      field: letter,
      width: 150,
    };
    if (letter === "A") {
      colDef.pinned = "left";
    }
    if (letter === "Z") {
      colDef.pinned = "right";
    }
    columnDefs.push(colDef);
  });
  return columnDefs;
}

function alphabet() {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
}

function createData(count, prefix) {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    const item = {};
    // mark every third row as full width. how you mark the row is up to you,
    // in this example the example code (not the grid code) looks at the
    // fullWidth attribute in the isFullWidthRow() callback. how you determine
    // if a row is full width or not is totally up to you.
    item.fullWidth = i % 3 === 2;
    // put in a column for each letter of the alphabet
    alphabet().forEach((letter) => {
      item[letter] = prefix + " (" + letter + "," + i + ")";
    });
    rowData.push(item);
  }
  return rowData;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(createData(100, "body"));
  const pinnedTopRowData = useMemo(() => {
    return createData(3, "pinned");
  }, []);
  const pinnedBottomRowData = useMemo(() => {
    return createData(3, "pinned");
  }, []);
  const [columnDefs, setColumnDefs] = useState(getColumnDefs());
  const isFullWidthRow = useCallback((params) => {
    // in this example, we check the fullWidth attribute that we set
    // while creating the data. what check you do to decide if you
    // want a row full width is up to you, as long as you return a boolean
    // for this method.
    return params.rowNode.data.fullWidth;
  }, []);
  const fullWidthCellRenderer = useCallback(FullWidthCellRenderer, []);
  const getRowHeight = useCallback((params) => {
    // you can have normal rows and full width rows any height that you want
    const isBodyRow = params.node.rowPinned === undefined;
    const isFullWidth = params.node.data.fullWidth;
    if (isBodyRow && isFullWidth) {
      return 75;
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          pinnedTopRowData={pinnedTopRowData}
          pinnedBottomRowData={pinnedBottomRowData}
          columnDefs={columnDefs}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
          getRowHeight={getRowHeight}
        />
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
