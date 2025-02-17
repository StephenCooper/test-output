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
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let versionCounter = 0;

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersion = response.rows.map((rowData) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
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
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "date" },
    { field: "country" },
    { field: "version" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      sortable: false,
      enableCellChangeFlash: true,
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

  const setRows = useCallback(() => {
    versionCounter += 1;
    const version =
      versionCounter + " - " + versionCounter + " - " + versionCounter;
    gridRef.current.api.forEachNode((node) => {
      node.setData({ ...node.data, version });
    });
  }, [versionCounter]);

  const updateRows = useCallback(() => {
    versionCounter += 1;
    const version =
      versionCounter + " - " + versionCounter + " - " + versionCounter;
    gridRef.current.api.forEachNode((node) => {
      node.updateData({ ...node.data, version });
    });
  }, [versionCounter]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={setRows}>Set Rows</button>
          <button onClick={updateRows}>Update Rows</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowModelType={"serverSide"}
            cacheBlockSize={75}
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
