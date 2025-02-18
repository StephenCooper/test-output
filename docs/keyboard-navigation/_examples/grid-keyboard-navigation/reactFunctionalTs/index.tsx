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
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  SideBarDef,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ClipboardModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Participant",
      children: [
        { field: "athlete", minWidth: 170 },
        { field: "country", minWidth: 150 },
      ],
    },
    { field: "sport" },
    {
      headerName: "Medals",
      children: [
        {
          field: "total",
          columnGroupShow: "closed",
          filter: "agNumberColumnFilter",
          width: 120,
          flex: 0,
        },
        {
          field: "gold",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
        {
          field: "silver",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
        {
          field: "bronze",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
      ],
    },
    { field: "year", filter: "agNumberColumnFilter" },
  ]);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
      flex: 1,
    };
  }, []);
  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: ["columns", "filters"],
      defaultToolPanel: "",
    };
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          rowSelection={rowSelection}
          defaultColDef={defaultColDef}
          sideBar={sideBar}
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
