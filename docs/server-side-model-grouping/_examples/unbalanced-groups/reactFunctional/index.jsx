"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ValidationModule } from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

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
      }, 2000);
    },
  };
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true, hide: true },
    { field: "sport" },
    { field: "year", minWidth: 100 },
    { field: "gold", aggFunc: "sum", enableValue: true },
    { field: "silver", aggFunc: "sum", enableValue: true },
    { field: "bronze", aggFunc: "sum", enableValue: true },
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
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // add unbalanced data to the top of the dataset
        const unbalancedData = data.map((item) => ({
          ...item,
          country: item.country === null ? "" : item.country,
        }));
        unbalancedData.sort((a, b) => (a.country === "" ? -1 : 1));
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(unbalancedData);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={"serverSide"}
          groupAllowUnbalanced={true}
          onGridReady={onGridReady}
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
