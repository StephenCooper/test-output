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
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const formatNumber = (number) => {
  return Math.floor(number).toLocaleString();
};

const createRowData = () => {
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
};

const GridExample = () => {
  const gridRef = useRef();
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
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    };
  }, []);

  const onFlashOneCell = useCallback(() => {
    // pick fourth row at random
    const rowNode = gridRef.current.api.getDisplayedRowAtIndex(4);
    // pick 'c' column
    gridRef.current.api.flashCells({ rowNodes: [rowNode], columns: ["c"] });
  }, []);

  const onFlashTwoColumns = useCallback(() => {
    // flash whole column, so leave row selection out
    gridRef.current.api.flashCells({ columns: ["c", "d"] });
  }, []);

  const onFlashTwoRows = useCallback(() => {
    // pick fourth and fifth row at random
    const rowNode1 = gridRef.current.api.getDisplayedRowAtIndex(4);
    const rowNode2 = gridRef.current.api.getDisplayedRowAtIndex(5);
    // flash whole row, so leave column selection out
    gridRef.current.api.flashCells({ rowNodes: [rowNode1, rowNode2] });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "4px" }}>
          <button onClick={onFlashOneCell} style={{ marginLeft: "15px" }}>
            Flash One Cell
          </button>
          <button onClick={onFlashTwoRows}>Flash Two Rows</button>
          <button onClick={onFlashTwoColumns}>Flash Two Columns</button>
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
