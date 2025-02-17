"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  CustomFilterModule,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getCountries } from "./countries";
import { CustomAgeFilter } from "./customAgeFilter";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CustomFilterModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const countries = getCountries();

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", enableRowGroup: true, filter: false },
    {
      field: "age",
      enableRowGroup: true,
      enablePivot: true,
      filter: CustomAgeFilter,
    },
    {
      field: "country",
      enableRowGroup: true,
      enablePivot: true,
      rowGroup: true,
      hide: true,
      filter: "agSetColumnFilter",
      filterParams: { values: countries },
    },
    {
      field: "year",
      enableRowGroup: true,
      enablePivot: true,
      rowGroup: true,
      hide: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["2000", "2002", "2004", "2006", "2008", "2010", "2012"],
      },
    },
    { field: "sport", enableRowGroup: true, enablePivot: true, filter: false },
    { field: "gold", aggFunc: "sum", filter: false, enableValue: true },
    { field: "silver", aggFunc: "sum", filter: false, enableValue: true },
    { field: "bronze", aggFunc: "sum", filter: false, enableValue: true },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      // restrict what aggregation functions the columns can have,
      // include a custom function 'random' that just returns a
      // random number
      allowedAggFuncs: ["sum", "min", "max", "random"],
      filter: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      width: 180,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={"serverSide"}
          rowGroupPanelShow={"always"}
          pivotPanelShow={"always"}
          sideBar={true}
          maxConcurrentDatasourceRequests={1}
          maxBlocksInCache={2}
          purgeClosedRowNodes={true}
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
