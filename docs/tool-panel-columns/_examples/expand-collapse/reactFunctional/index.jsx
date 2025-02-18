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
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  PivotModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
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
        {
          groupId: "competitionGroupId",
          headerName: "Competition",
          children: [{ field: "year" }, { field: "date", minWidth: 180 }],
        },
      ],
    },
    {
      groupId: "medalsGroupId",
      headerName: "Medals",
      children: [
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      // allow every column to be aggregated
      enableValue: true,
      // allow every column to be grouped
      enableRowGroup: true,
      // allow every column to be pivoted
      enablePivot: true,
      filter: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    const columnToolPanel = params.api.getToolPanelInstance("columns");
    columnToolPanel.collapseColumnGroups();
  }, []);

  const expandAllGroups = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.expandColumnGroups();
  }, []);

  const collapseAllGroups = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.collapseColumnGroups();
  }, []);

  const expandAthleteAndCompetitionGroups = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.expandColumnGroups([
      "athleteGroupId",
      "competitionGroupId",
    ]);
  }, []);

  const collapseCompetitionGroups = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.collapseColumnGroups(["competitionGroupId"]);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <span className="button-group">
            <button onClick={expandAllGroups}>Expand All</button>
            <button onClick={collapseAllGroups}>Collapse All</button>
            <button onClick={expandAthleteAndCompetitionGroups}>
              Expand Athlete &amp; Competition
            </button>
            <button onClick={collapseCompetitionGroups}>
              Collapse Competition
            </button>
          </span>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={"columns"}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();
