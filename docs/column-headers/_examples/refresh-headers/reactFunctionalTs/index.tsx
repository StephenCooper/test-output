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
import CustomHeader from "./customHeader.tsx";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

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
      headerComponent: CustomHeader,
    };
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onBtUpperNames = useCallback(() => {
    const columnDefs: ColDef[] = [
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
    ];
    columnDefs.forEach((c) => {
      c.headerName = c.field!.toUpperCase();
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtLowerNames = useCallback(() => {
    const columnDefs: ColDef[] = [
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
    ];
    columnDefs.forEach((c) => {
      c.headerName = c.field;
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtFilterOn = useCallback(() => {
    const columnDefs: ColDef[] = [
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
    ];
    columnDefs.forEach((c) => {
      c.filter = true;
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtFilterOff = useCallback(() => {
    const columnDefs: ColDef[] = [
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
    ];
    columnDefs.forEach((c) => {
      c.filter = false;
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtResizeOn = useCallback(() => {
    const columnDefs: ColDef[] = [
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
    ];
    columnDefs.forEach((c) => {
      c.resizable = true;
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtResizeOff = useCallback(() => {
    const columnDefs: ColDef[] = [
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
    ];
    columnDefs.forEach((c) => {
      c.resizable = false;
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtUpperNames}>Upper Header Names</button>
          <button onClick={onBtLowerNames}>Lower Header Names</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={onBtFilterOn}>Filter On</button>
          <button onClick={onBtFilterOff}>Filter Off</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={onBtResizeOn}>Resize On</button>
          <button onClick={onBtResizeOff}>Resize Off</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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
