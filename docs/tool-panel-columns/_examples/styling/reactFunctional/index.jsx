"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
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
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function countryHeaderValueGetter(params) {
  switch (params.location) {
    case "csv":
      return "CSV Country";
    case "columnToolPanel":
      return "TP Country";
    case "columnDrop":
      return "CD Country";
    case "header":
      return "H Country";
    default:
      return "Should never happen!";
  }
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "age",
      enableValue: true,
    },
    {
      field: "country",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
      headerValueGetter: countryHeaderValueGetter,
    },
    {
      field: "year",
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "date",
      minWidth: 180,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "sport",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "gold",
      hide: true,
      enableValue: true,
      toolPanelClass: "tp-gold",
    },
    {
      field: "silver",
      hide: true,
      enableValue: true,
      toolPanelClass: ["tp-silver"],
    },
    {
      field: "bronze",
      hide: true,
      enableValue: true,
      toolPanelClass: (params) => {
        return "tp-bronze";
      },
    },
    {
      headerName: "Total",
      field: "total",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
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
          autoGroupColumnDef={autoGroupColumnDef}
          sideBar={"columns"}
          rowGroupPanelShow={"always"}
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
window.tearDownExample = () => root.unmount();
