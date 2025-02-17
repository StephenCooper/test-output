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
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      // get data for request from our fake server
      const response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
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
    {
      field: "athlete",
      filter: "agTextColumnFilter",
      minWidth: 220,
    },
    {
      field: "year",
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["reset"],
        debounceMs: 1000,
        maxNumConditions: 1,
      },
    },
    { field: "gold", type: "number" },
    { field: "silver", type: "number" },
    { field: "bronze", type: "number" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);
  const columnTypes = useMemo(() => {
    return {
      number: { filter: "agNumberColumnFilter" },
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
          columnTypes={columnTypes}
          rowModelType={"serverSide"}
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
