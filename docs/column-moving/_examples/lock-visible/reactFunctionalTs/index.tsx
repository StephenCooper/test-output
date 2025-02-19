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
import "./style.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", width: 150 },
        { field: "age", lockVisible: true, cellClass: "locked-visible" },
        { field: "country", width: 150 },
        { field: "year" },
        { field: "date" },
        { field: "sport" },
      ],
    },
    {
      headerName: "Medals",
      children: [
        { field: "gold", lockVisible: true, cellClass: "locked-visible" },
        { field: "silver", lockVisible: true, cellClass: "locked-visible" },
        { field: "bronze", lockVisible: true, cellClass: "locked-visible" },
        {
          field: "total",
          lockVisible: true,
          cellClass: "locked-visible",
          hide: true,
        },
      ],
    },
  ]);
  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
          },
        },
      ],
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 100,
    };
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="legend-bar">
          <span className="legend-box locked-visible"></span> Locked Visible
          Column
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            sideBar={sideBar}
            defaultColDef={defaultColDef}
            allowDragFromColumnsToolPanel={true}
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
