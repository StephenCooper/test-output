'use client';
import { useFetchJson } from './useFetchJson';
import React, { StrictMode, useCallback, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import MenuItem from "./menuItem";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,

  ContextMenuModule,
  ExcelExportModule,
  CellSelectionModule,
  ClipboardModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "year" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const getMainMenuItems = useCallback((params) => {
    return [
      ...params.defaultItems,
      "separator",
      {
        name: "Click Alert Button and Close Menu",
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
      {
        name: "Click Alert Button and Keep Menu Open",
        suppressCloseOnSelect: true,
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
    ];
  }, []);

  const getContextMenuItems = useCallback((params) => {
    return [
      ...(params.defaultItems || []),
      "separator",
      {
        name: "Click Alert Button and Close Menu",
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
      {
        name: "Click Alert Button and Keep Menu Open",
        suppressCloseOnSelect: true,
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
    ];
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getMainMenuItems={getMainMenuItems}
          getContextMenuItems={getContextMenuItems}
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
