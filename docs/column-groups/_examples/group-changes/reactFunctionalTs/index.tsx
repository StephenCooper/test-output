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

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", colId: "athlete" },
    { field: "age", colId: "age" },
    { field: "country", colId: "country" },
    { field: "year", colId: "year" },
    { field: "date", colId: "date" },
    { field: "total", colId: "total" },
    { field: "gold", colId: "gold" },
    { field: "silver", colId: "silver" },
    { field: "bronze", colId: "bronze" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      initialWidth: 150,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onBtNoGroups = useCallback(() => {
    const columnDefs: ColDef[] = [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "date", colId: "date" },
      { field: "total", colId: "total" },
      { field: "gold", colId: "gold" },
      { field: "silver", colId: "silver" },
      { field: "bronze", colId: "bronze" },
    ];
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onMedalsInGroupOnly = useCallback(() => {
    const columnDefs: (ColDef | ColGroupDef)[] = [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "date", colId: "date" },
      {
        headerName: "Medals",
        headerClass: "medals-group",
        children: [
          { field: "total", colId: "total" },
          { field: "gold", colId: "gold" },
          { field: "silver", colId: "silver" },
          { field: "bronze", colId: "bronze" },
        ],
      },
    ];
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onParticipantInGroupOnly = useCallback(() => {
    const columnDefs: (ColDef | ColGroupDef)[] = [
      {
        headerName: "Participant",
        headerClass: "participant-group",
        children: [
          { field: "athlete", colId: "athlete" },
          { field: "age", colId: "age" },
          { field: "country", colId: "country" },
          { field: "year", colId: "year" },
          { field: "date", colId: "date" },
        ],
      },
      { field: "total", colId: "total" },
      { field: "gold", colId: "gold" },
      { field: "silver", colId: "silver" },
      { field: "bronze", colId: "bronze" },
    ];
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onParticipantAndMedalsInGroups = useCallback(() => {
    const columnDefs: (ColDef | ColGroupDef)[] = [
      {
        headerName: "Participant",
        headerClass: "participant-group",
        children: [
          { field: "athlete", colId: "athlete" },
          { field: "age", colId: "age" },
          { field: "country", colId: "country" },
          { field: "year", colId: "year" },
          { field: "date", colId: "date" },
        ],
      },
      {
        headerName: "Medals",
        headerClass: "medals-group",
        children: [
          { field: "total", colId: "total" },
          { field: "gold", colId: "gold" },
          { field: "silver", colId: "silver" },
          { field: "bronze", colId: "bronze" },
        ],
      },
    ];
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <label>
            <button onClick={onBtNoGroups}>No Groups</button>
          </label>
          <label>
            <div className="participant-group legend-box"></div>
            <button onClick={onParticipantInGroupOnly}>
              Participant in Group
            </button>
          </label>
          <label>
            <div className="medals-group legend-box"></div>
            <button onClick={onMedalsInGroupOnly}>Medals in Group</button>
          </label>
          <label>
            <div className="participant-group legend-box"></div>
            <div className="medals-group legend-box"></div>
            <button onClick={onParticipantAndMedalsInGroups}>
              Participant and Medals in Group
            </button>
          </label>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            maintainColumnOrder={true}
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
