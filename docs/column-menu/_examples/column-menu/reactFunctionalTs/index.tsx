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
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ColumnAutoSizeModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 200 },
    { field: "age", filter: true },
    { field: "country", filter: true, floatingFilter: true, minWidth: 200 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
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
