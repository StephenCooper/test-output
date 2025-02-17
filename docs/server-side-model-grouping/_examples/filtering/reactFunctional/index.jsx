"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    {
      field: "year",
      minWidth: 100,
      filter: "agNumberColumnFilter",
      floatingFilter: true,
    },
    {
      field: "gold",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableValue: true,
    },
    {
      field: "silver",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableValue: true,
    },
    {
      field: "bronze",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableValue: true,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 120,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 280,
      field: "athlete",
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
          serverSideOnlyRefreshFilteredGroups={true}
          rowModelType={"serverSide"}
          cacheBlockSize={5}
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
