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
  SideBarDef,
  TextEditorModule,
  Theme,
  ValidationModule,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const myTheme = themeQuartz
  .withPart(
    iconOverrides({
      type: "image",
      icons: {
        filter: {
          url: "https://www.ag-grid.com/example-assets/svg-icons/filter.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "image",
      mask: true,
      icons: {
        "menu-alt": {
          url: "https://www.ag-grid.com/example-assets/svg-icons/menu-alt.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "font",
      icons: {
        columns: "🏛️",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: ["https://use.fontawesome.com/releases/v5.6.3/css/all.css"],
      type: "font",
      weight: "bold",
      family: "Font Awesome 5 Free",
      color: "green",
      icons: {
        asc: "\u{f062}",
        desc: "\u{f063}",
        "tree-closed": "\u{f105}",
        "tree-indeterminate": "\u{f068}",
        "tree-open": "\u{f107}",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: [
        "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.css",
      ],
      type: "font",
      family: "Material Design Icons",
      color: "red",
      icons: {
        group: "\u{F0328}",
        aggregation: "\u{F02C3}",
      },
    }),
  );

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", sort: "asc", rowGroup: true, hide: true },
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Country",
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
          theme={theme}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          sideBar={true}
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
