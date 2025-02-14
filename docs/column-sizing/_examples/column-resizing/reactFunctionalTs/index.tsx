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
  ColumnApiModule,
  ColumnAutoSizeModule,
  ColumnResizedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", width: 150, suppressSizeToFit: true },
    {
      field: "age",
      headerName: "Age of Athlete",
      width: 90,
      minWidth: 50,
      maxWidth: 150,
    },
    { field: "country", width: 120 },
    { field: "year", width: 90 },
    { field: "date", width: 110 },
    { field: "sport", width: 110 },
    { field: "gold", width: 100 },
    { field: "silver", width: 100 },
    { field: "bronze", width: 100 },
    { field: "total", width: 100 },
  ]);
  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: "fitCellContents",
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onColumnResized = useCallback((params: ColumnResizedEvent) => {
    console.log(params);
  }, []);

  const autoSizeAll = useCallback((skipHeader: boolean) => {
    const allColumnIds: string[] = [];
    gridRef.current!.api.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridRef.current!.api.autoSizeColumns(allColumnIds, skipHeader);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="outer-div">
        <div className="button-bar">
          <button onClick={() => autoSizeAll(false)}>
            Resize Columns to Fit Cell Contents
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact<IOlympicData>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              autoSizeStrategy={autoSizeStrategy}
              onGridReady={onGridReady}
              onColumnResized={onColumnResized}
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
(window as any).tearDownExample = () => root.unmount();
