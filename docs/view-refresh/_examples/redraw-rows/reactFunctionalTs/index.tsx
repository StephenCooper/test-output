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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let colorIndex = 0;

const colors = ["#99999944", "#CC333344", "#33CC3344", "#2244CC44"];

function createData(count: number) {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return result;
}

function progressColor() {
  colorIndex++;
  if (colorIndex === colors.length) {
    colorIndex = 0;
  }
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(createData(12));
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "C", field: "c" },
    { headerName: "D", field: "d" },
    { headerName: "E", field: "e" },
    { headerName: "F", field: "f" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const getRowStyle = useCallback(
    (params: RowClassParams): RowStyle | undefined => {
      return {
        backgroundColor: colors[colorIndex],
      };
    },
    [],
  );

  const redrawAllRows = useCallback(() => {
    progressColor();
    gridRef.current!.api.redrawRows();
  }, []);

  const redrawTopRows = useCallback(() => {
    progressColor();
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const row = gridRef.current!.api.getDisplayedRowAtIndex(i)!;
      rows.push(row);
    }
    gridRef.current!.api.redrawRows({ rowNodes: rows });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={redrawAllRows}>Redraw All Rows</button>
          <button onClick={redrawTopRows}>Redraw Top Rows</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowStyle={getRowStyle}
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
