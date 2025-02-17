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
  ISetFilter,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

let savedMiniFilterText: string | null = "";

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", filter: "agSetColumnFilter" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }, []);

  const getMiniFilterText = useCallback(() => {
    gridRef
      .current!.api.getColumnFilterInstance<ISetFilter>("athlete")
      .then((athleteFilter) => {
        console.log(athleteFilter!.getMiniFilter());
      });
  }, []);

  const saveMiniFilterText = useCallback(() => {
    gridRef
      .current!.api.getColumnFilterInstance<ISetFilter>("athlete")
      .then((athleteFilter) => {
        savedMiniFilterText = athleteFilter!.getMiniFilter();
      });
  }, []);

  const restoreMiniFilterText = useCallback(() => {
    gridRef
      .current!.api.getColumnFilterInstance<ISetFilter>("athlete")
      .then((athleteFilter) => {
        athleteFilter!.setMiniFilter(savedMiniFilterText);
      });
  }, [savedMiniFilterText]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <button onClick={getMiniFilterText}>Get Mini Filter Text</button>
          <button onClick={saveMiniFilterText}>Save Mini Filter Text</button>
          <button onClick={restoreMiniFilterText}>
            Restore Mini Filter Text
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
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
