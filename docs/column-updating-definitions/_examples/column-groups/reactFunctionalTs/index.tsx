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

const createColSetA: () => ColGroupDef[] = () => {
  return [
    {
      headerName: "Group A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ];
};

const createColSetB: () => ColGroupDef[] = () => {
  return [
    {
      headerName: "GROUP A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
        { field: "extraA" },
        { field: "extraB", columnGroupShow: "open" },
      ],
    },
  ];
};

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      initialWidth: 100,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Group A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        setRowData(data);
      });
  }, []);

  const onBtSetA = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", createColSetA());
  }, []);

  const onBtSetB = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", createColSetB());
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtSetA}>First Column Set</button>
          <button onClick={onBtSetB}>Second Column Set</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
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
