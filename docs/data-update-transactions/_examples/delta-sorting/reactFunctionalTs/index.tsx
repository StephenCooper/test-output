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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let lastGen = 0;

const generateItem = (id = lastGen++) => {
  return {
    id,
    sort: Math.floor(Math.random() * 3 + 2000),
    sort1: Math.floor(Math.random() * 3 + 2000),
    sort2: Math.floor(Math.random() * 100000 + 2000),
  };
};

const getRowData = (rows = 10) =>
  new Array(rows).fill(undefined).map((_) => generateItem());

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getRowData(100000));
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id" },
    { field: "updatedBy" },
    { field: "sort", sortIndex: 0, sort: "desc" },
    { field: "sort1", sortIndex: 1, sort: "desc" },
    { field: "sort2", sortIndex: 2, sort: "desc" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const getRowId = useCallback(
    ({ data }: GetRowIdParams) => String(data.id),
    [],
  );

  const addDelta = useCallback(() => {
    const transaction = {
      add: getRowData(1).map((row) => ({ ...row, updatedBy: "delta" })),
      update: [{ id: 1, make: "Delta", updatedBy: "delta" }],
    };
    gridRef.current!.api.setGridOption("deltaSort", true);
    const startTime = new Date().getTime();
    gridRef.current!.api.applyTransaction(transaction);
    document.getElementById("transactionDuration")!.textContent =
      `${new Date().getTime() - startTime} ms`;
  }, [getRowData]);

  const addDefault = useCallback(() => {
    const transaction = {
      add: getRowData(1).map((row) => ({ ...row, updatedBy: "default" })),
      update: [{ id: 2, make: "Default", updatedBy: "default" }],
    };
    gridRef.current!.api.setGridOption("deltaSort", false);
    const startTime = new Date().getTime();
    gridRef.current!.api.applyTransaction(transaction);
    document.getElementById("transactionDuration")!.textContent =
      `${new Date().getTime() - startTime} ms`;
  }, [getRowData]);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div>
            <button onClick={addDefault}>Default Transaction</button>
            <button onClick={addDelta}>Delta Transaction</button>
            Transaction took: <span id="transactionDuration">N/A</span>
          </div>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            deltaSort={true}
            getRowId={getRowId}
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
