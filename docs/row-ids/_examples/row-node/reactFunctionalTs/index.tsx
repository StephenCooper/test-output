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
  GetRowIdParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    { id: "c1", make: "Toyota", model: "Celica", price: 35000 },
    { id: "c2", make: "Ford", model: "Mondeo", price: 32000 },
    { id: "c8", make: "Porsche", model: "Boxster", price: 72000 },
    { id: "c4", make: "BMW", model: "M50", price: 60000 },
    { id: "c14", make: "Aston Martin", model: "DBX", price: 190000 },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", headerName: "Row ID" },
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.id),
    [],
  );

  const getAllRows = useCallback(() => {
    gridRef.current!.api.forEachNode((rowNode) => {
      console.log(`=============== ROW ${rowNode.rowIndex}`);
      console.log(`id = ${rowNode.id}`);
      console.log(`rowIndex = ${rowNode.rowIndex}`);
      console.log(`data = ${JSON.stringify(rowNode.data)}`);
      console.log(`group = ${rowNode.group}`);
      console.log(`height = ${rowNode.rowHeight}px`);
      console.log(`isSelected = ${rowNode.isSelected()}`);
    });
    window.alert("Row details printed to developers console");
  }, [window]);

  const getRowById = useCallback(() => {
    const rowNode = gridRef.current!.api.getRowNode("c2");
    if (rowNode && rowNode.id == "c2") {
      console.log(`################ Got Row Node C2`);
      console.log(`data = ${JSON.stringify(rowNode.data)}`);
    }
    window.alert("Row details printed to developers console");
  }, [window]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={getAllRows}>Log All Rows</button>
          <button onClick={getRowById}>Get ONE Row</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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
(window as any).tearDownExample = () => root.unmount();
