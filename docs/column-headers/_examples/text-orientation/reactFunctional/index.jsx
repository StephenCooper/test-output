"use client";

import React, { useMemo, useState, StrictMode } from "react";
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
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete Details",
      children: [
        {
          field: "athlete",
          width: 150,
          suppressSizeToFit: true,
          enableRowGroup: true,
          rowGroupIndex: 0,
        },
        {
          field: "age",
          width: 90,
          minWidth: 75,
          maxWidth: 100,
          enableRowGroup: true,
        },
        {
          field: "country",
          width: 120,
          enableRowGroup: true,
        },
        {
          field: "year",
          width: 90,
          enableRowGroup: true,
        },
        { field: "sport", width: 110, enableRowGroup: true },
        {
          field: "gold",
          width: 60,
          enableValue: true,
          suppressHeaderMenuButton: true,
          suppressHeaderFilterButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "silver",
          width: 60,
          enableValue: true,
          suppressHeaderMenuButton: true,
          suppressHeaderFilterButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "bronze",
          width: 60,
          enableValue: true,
          suppressHeaderMenuButton: true,
          suppressHeaderFilterButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "total",
          width: 60,
          enableValue: true,
          suppressHeaderMenuButton: true,
          suppressHeaderFilterButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
      ],
    },
  ]);

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
          groupHeaderHeight={75}
          headerHeight={150}
          floatingFiltersHeight={50}
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
