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
  Column,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 150,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onMedalsFirst = useCallback(() => {
    gridRef.current!.api.moveColumns(["gold", "silver", "bronze", "total"], 0);
  }, []);

  const onMedalsLast = useCallback(() => {
    gridRef.current!.api.moveColumns(["gold", "silver", "bronze", "total"], 6);
  }, []);

  const onCountryFirst = useCallback(() => {
    gridRef.current!.api.moveColumns(["country"], 0);
  }, []);

  const onSwapFirstTwo = useCallback(() => {
    gridRef.current!.api.moveColumnByIndex(0, 1);
  }, []);

  const onPrintColumns = useCallback(() => {
    const cols = gridRef.current!.api.getAllGridColumns();
    const colToNameFunc = (col: Column, index: number) =>
      index + " = " + col.getId();
    const colNames = cols.map(colToNameFunc).join(", ");
    console.log("columns are: " + colNames);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={onMedalsFirst}>Medals First</button>
          <button onClick={onMedalsLast}>Medals Last</button>
          <button onClick={onCountryFirst}>Country First</button>
          <button onClick={onSwapFirstTwo}>Swap First Two</button>
          <button onClick={onPrintColumns}>Print Columns</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressDragLeaveHidesColumns={true}
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
