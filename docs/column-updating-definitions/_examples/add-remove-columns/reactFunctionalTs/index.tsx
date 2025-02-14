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
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefsMedalsIncluded: ColDef[] = [
  { field: "athlete" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
];

const colDefsMedalsExcluded: ColDef[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
];

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(
    columnDefsMedalsIncluded,
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      initialWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onBtExcludeMedalColumns = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", colDefsMedalsExcluded);
  }, [colDefsMedalsExcluded]);

  const onBtIncludeMedalColumns = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", columnDefsMedalsIncluded);
  }, [columnDefsMedalsIncluded]);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtExcludeMedalColumns}>
            Exclude Medal Columns
          </button>
          <button onClick={onBtIncludeMedalColumns}>
            Include Medal Columns
          </button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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
