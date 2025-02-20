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
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  SideBarDef,
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
import { createFakeServer, createServerSideDatasource } from "./server";
import { IOlympicData } from "./interfaces";
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

const countries = getCountries();

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
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
  const defaultColDef = useMemo<ColDef>(() => {
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
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      width: 180,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
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
          onGridReady={onGridReady}
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
