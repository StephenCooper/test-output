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
import "./styles.css";
import {
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowApiModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
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
            groupLevelInfo: {
              lastLoadedTime: new Date().toLocaleString(),
              randomValue: Math.random(),
            },
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
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "year",
      enableRowGroup: true,
      rowGroup: true,
      hide: true,
      minWidth: 100,
    },
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "sport", enableRowGroup: true, rowGroup: true, hide: true },
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
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  const onBtExpandAll = useCallback(() => {
    gridRef.current.api.expandAll();
  }, []);

  const onBtCollapseAll = useCallback(() => {
    gridRef.current.api.collapseAll();
  }, []);

  const onBtExpandTopLevel = useCallback(() => {
    gridRef.current.api.forEachNode(function (node) {
      if (node.group && node.level == 0) {
        node.setExpanded(true);
      }
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={onBtExpandAll}>Expand All</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={onBtCollapseAll}>Collapse All</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={onBtExpandTopLevel}>Expand Top Level Only</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            maxConcurrentDatasourceRequests={1}
            rowModelType={"serverSide"}
            onGridReady={onGridReady}
          />
        </div>
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
