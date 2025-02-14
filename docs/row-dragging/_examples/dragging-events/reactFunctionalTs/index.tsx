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
  NumberFilterModule,
  RowDragCancelEvent,
  RowDragEndEvent,
  RowDragEnterEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", rowDrag: true },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 170,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onRowDragEnter = useCallback((e: RowDragEnterEvent) => {
    console.log("onRowDragEnter", e);
  }, []);

  const onRowDragEnd = useCallback((e: RowDragEndEvent) => {
    console.log("onRowDragEnd", e);
  }, []);

  const onRowDragMove = useCallback((e: RowDragMoveEvent) => {
    console.log("onRowDragMove", e);
  }, []);

  const onRowDragLeave = useCallback((e: RowDragLeaveEvent) => {
    console.log("onRowDragLeave", e);
  }, []);

  const onRowDragCancel = useCallback((e: RowDragCancelEvent) => {
    console.log("onRowDragCancel", e);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div
          className="example-header"
          style={{ backgroundColor: "#ccaa22a9" }}
        >
          Rows in this example do not move, only events are fired
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onRowDragEnter={onRowDragEnter}
            onRowDragEnd={onRowDragEnd}
            onRowDragMove={onRowDragMove}
            onRowDragLeave={onRowDragLeave}
            onRowDragCancel={onRowDragCancel}
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
