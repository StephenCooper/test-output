'use client';
import { useFetchJson } from './useFetchJson';
import React, { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import YearFilter from "./YearFilter";
import YearFloatingFilter from "./YearFloatingFilter";
import "./style.css";

ModuleRegistry.registerModules([
  NumberFilterModule,
  TextFilterModule,
  ClientSideRowModelModule,
  MultiFilterModule,
  SetFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
  ClipboardModule,
  FiltersToolPanelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", filter: "agMultiColumnFilter" },
    { field: "sport", filter: "agMultiColumnFilter" },
    {
      field: "year",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: YearFilter,
            floatingFilterComponent: YearFloatingFilter,
          },
          {
            filter: "agNumberColumnFilter",
          },
        ],
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 200,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
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
