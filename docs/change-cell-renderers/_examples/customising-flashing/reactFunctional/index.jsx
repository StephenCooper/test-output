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
  CellStyleModule,
  ClientSideRowModelModule,
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function formatNumber(number) {
  return Math.floor(number).toLocaleString();
}

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 25435) % 10000),
      b: Math.floor(((i + 323) * 23221) % 10000),
      c: Math.floor(((i + 323) * 468276) % 10000),
      d: 0,
      e: 0,
      f: 0,
    });
  }
  return rowData;
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(createRowData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      cellClass: "align-right",
      enableCellChangeFlash: true,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    };
  }, []);

  const onUpdateSomeValues = useCallback(() => {
    const rowCount = gridRef.current.api.getDisplayedRowCount();
    // pick 20 cells at random to update
    for (let i = 0; i < 20; i++) {
      const row = Math.floor(Math.random() * rowCount);
      const rowNode = gridRef.current.api.getDisplayedRowAtIndex(row);
      const col = ["a", "b", "c", "d", "e", "f"][i % 6];
      rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "4px" }}>
          <button onClick={onUpdateSomeValues}>Update Some Data</button>
        </div>
        <div style={{ flexGrow: "1" }}>
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
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
