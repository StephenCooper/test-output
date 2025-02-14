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
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  RowAutoHeightModule,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const getServerSideDatasource: (server: any) => IServerSideDatasource = (
  server: any,
) => {
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
      }, 200);
    },
  };
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Group",
      field: "name",
      rowGroup: true,
      hide: true,
    },
    {
      field: "autoA",
      wrapText: true,
      autoHeight: true,
      aggFunc: "last",
    },
    {
      field: "autoB",
      wrapText: true,
      autoHeight: true,
      aggFunc: "last",
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      maxWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // generate data for example
    const data = getData();
    // setup the fake server with entire dataset
    const fakeServer = new FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(fakeServer);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={"serverSide"}
          suppressAggFuncInHeader={true}
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
