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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getColumnDefsA: () => ColDef[] = () => {
  return [
    { field: "athlete", headerName: "A Athlete" },
    { field: "age", headerName: "A Age" },
    { field: "country", headerName: "A Country" },
    { field: "sport", headerName: "A Sport" },
    { field: "year", headerName: "A Year" },
    { field: "date", headerName: "A Date" },
    { field: "gold", headerName: "A Gold" },
    { field: "silver", headerName: "A Silver" },
    { field: "bronze", headerName: "A Bronze" },
    { field: "total", headerName: "A Total" },
  ];
};

const getColumnDefsB: () => ColDef[] = () => {
  return [
    { field: "gold", headerName: "B Gold" },
    { field: "silver", headerName: "B Silver" },
    { field: "bronze", headerName: "B Bronze" },
    { field: "total", headerName: "B Total" },
    { field: "athlete", headerName: "B Athlete" },
    { field: "age", headerName: "B Age" },
    { field: "country", headerName: "B Country" },
    { field: "sport", headerName: "B Sport" },
    { field: "year", headerName: "B Year" },
    { field: "date", headerName: "B Date" },
  ];
};

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      initialWidth: 100,
      filter: true,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(getColumnDefsA());

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const setColsA = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", getColumnDefsA());
  }, []);

  const setColsB = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", getColumnDefsB());
  }, []);

  const clearColDefs = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", []);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={setColsA}>Column Set A</button>
          <button onClick={setColsB}>Column Set B</button>
          <button onClick={clearColDefs}>Clear</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={data}
            loading={loading}
            defaultColDef={defaultColDef}
            maintainColumnOrder={true}
            columnDefs={columnDefs}
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
