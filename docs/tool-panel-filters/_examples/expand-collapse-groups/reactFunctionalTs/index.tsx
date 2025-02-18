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
  SideBarDef,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
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

  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      groupId: "athleteGroupId",
      headerName: "Athlete",
      children: [
        {
          headerName: "Name",
          field: "athlete",
          minWidth: 200,
          filter: "agTextColumnFilter",
        },
        { field: "age" },
        {
          groupId: "competitionGroupId",
          headerName: "Competition",
          children: [{ field: "year" }, { field: "date", minWidth: 180 }],
        },
        { field: "country", minWidth: 200 },
      ],
    },
    { colId: "sport", field: "sport", minWidth: 200 },
    {
      headerName: "Medals",
      children: [
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // initially collapse all filter groups
    params.api.getToolPanelInstance("filters")!.collapseFilterGroups();
  }, []);

  const collapseAll = useCallback(() => {
    gridRef
      .current!.api.getToolPanelInstance("filters")!
      .collapseFilterGroups();
  }, []);

  const expandAthleteAndCompetition = useCallback(() => {
    gridRef
      .current!.api.getToolPanelInstance("filters")!
      .expandFilterGroups(["athleteGroupId", "competitionGroupId"]);
  }, []);

  const collapseCompetition = useCallback(() => {
    gridRef
      .current!.api.getToolPanelInstance("filters")!
      .collapseFilterGroups(["competitionGroupId"]);
  }, []);

  const expandAll = useCallback(() => {
    gridRef.current!.api.getToolPanelInstance("filters")!.expandFilterGroups();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <span className="button-group">
            <button onClick={expandAthleteAndCompetition}>
              Expand Athlete &amp; Competition
            </button>
            <button onClick={collapseCompetition}>Collapse Competition</button>
            <button onClick={expandAll}>Expand All</button>
            <button onClick={collapseAll}>Collapse All</button>
          </span>
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
