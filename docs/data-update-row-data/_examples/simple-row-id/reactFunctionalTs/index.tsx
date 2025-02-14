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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface ICar {
  id: string;
  make: string;
  model: string;
  price: number;
}

// specify the data
const rowDataA: ICar[] = [
  { id: "1", make: "Toyota", model: "Celica", price: 35000 },
  { id: "4", make: "BMW", model: "M50", price: 60000 },
  { id: "5", make: "Aston Martin", model: "DBX", price: 190000 },
];

const rowDataB: ICar[] = [
  { id: "1", make: "Toyota", model: "Celica", price: 35000 },
  { id: "2", make: "Ford", model: "Mondeo", price: 32000 },
  { id: "3", make: "Porsche", model: "Boxster", price: 72000 },
  { id: "4", make: "BMW", model: "M50", price: 60000 },
  { id: "5", make: "Aston Martin", model: "DBX", price: 190000 },
];

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<ICar[]>(rowDataA);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "singleRow", checkboxes: false, enableClickSelection: true };
  }, []);
  const getRowId = useCallback(
    (params: GetRowIdParams<ICar>) => params.data.id,
    [],
  );

  const onRowDataA = useCallback(() => {
    setRowData(rowDataA);
  }, [rowDataA]);

  const onRowDataB = useCallback(() => {
    setRowData(rowDataB);
  }, [rowDataB]);

  const onClearRowData = useCallback(() => {
    setRowData([]);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "5px", minHeight: "30px" }}>
          <button onClick={onRowDataA}>Row Data A</button>
          <button onClick={onRowDataB}>Row Data B</button>
          <button onClick={onClearRowData}>Clear Row Data</button>
        </div>
        <div style={{ flex: "1 1 0px" }}>
          <div style={gridStyle}>
            <AgGridReact<ICar>
              rowData={rowData}
              columnDefs={columnDefs}
              rowSelection={rowSelection}
              getRowId={getRowId}
            />
          </div>
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
