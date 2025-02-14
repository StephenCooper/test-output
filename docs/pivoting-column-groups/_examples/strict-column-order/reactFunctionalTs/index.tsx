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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let count = 0;

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "pivotValue", pivot: true },
    { field: "agg", aggFunc: "sum", rowGroup: true },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 130,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 100,
    };
  }, []);
  const getRowId = useCallback((p) => String(p.data.pivotValue), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setInterval(() => {
      count += 1;
      const rowData = getData();
      params.api.setGridOption(
        "rowData",
        rowData.slice(0, (count % rowData.length) + 1),
      );
    }, 1000);
  }, []);

  const toggleOption = useCallback(() => {
    const isChecked = document.querySelector<HTMLInputElement>(
      "#enableStrictPivotColumnOrder",
    )!.checked;
    gridRef.current!.api.setGridOption(
      "enableStrictPivotColumnOrder",
      isChecked,
    );
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>enableStrictPivotColumnOrder:</span>
            <input
              id="enableStrictPivotColumnOrder"
              type="checkbox"
              onChange={toggleOption}
            />
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            pivotMode={true}
            getRowId={getRowId}
            onGridReady={onGridReady}
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
(window as any).tearDownExample = () => root.unmount();
