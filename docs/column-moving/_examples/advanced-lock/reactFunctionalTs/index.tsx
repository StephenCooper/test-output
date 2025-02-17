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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  ColumnPinnedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import ControlsCellRenderer from "./controlsCellRenderer.tsx";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      lockPosition: "left",
      cellRenderer: ControlsCellRenderer,
      cellClass: "locked-col",
      width: 120,
      suppressNavigable: true,
    },
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

  const onColumnPinned = useCallback((event: ColumnPinnedEvent) => {
    const allCols = event.api.getAllGridColumns();
    if (event.pinned !== "right") {
      const allFixedCols = allCols.filter(
        (col) => col.getColDef().lockPosition,
      );
      event.api.setColumnsPinned(allFixedCols, event.pinned);
    }
  }, []);

  const onPinAthleteLeft = useCallback(() => {
    gridRef.current!.api.applyColumnState({
      state: [{ colId: "athlete", pinned: "left" }],
    });
  }, []);

  const onPinAthleteRight = useCallback(() => {
    gridRef.current!.api.applyColumnState({
      state: [{ colId: "athlete", pinned: "right" }],
    });
  }, []);

  const onUnpinAthlete = useCallback(() => {
    gridRef.current!.api.applyColumnState({
      state: [{ colId: "athlete", pinned: null }],
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="legend-bar">
          <button onClick={onPinAthleteLeft}>Pin Athlete Left</button>
          <button onClick={onPinAthleteRight}>Pin Athlete Right</button>
          <button onClick={onUnpinAthlete}>Un-Pin Athlete</button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="locked-col legend-box"></span> Position Locked Column
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressDragLeaveHidesColumns={true}
            onColumnPinned={onColumnPinned}
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
