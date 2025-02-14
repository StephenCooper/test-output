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
import { FakeServer } from "./fakeServer.jsx";
import {
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

let allData;

let versionCounter = 1;

const updateChangeIndicator = () => {
  const el = document.querySelector("#version-indicator");
  el.textContent = `${versionCounter}`;
};

const beginPeriodicallyModifyingData = () => {
  setInterval(() => {
    versionCounter += 1;
    allData = allData.map((data) => ({
      ...data,
      version: versionCounter + " - " + versionCounter + " - " + versionCounter,
    }));
    updateChangeIndicator();
  }, 4000);
};

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersionAndGroupProperties = response.rows.map((rowData) => {
        const rowProperties = {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
        // for unique-id purposes in the client, we also want to attach
        // the parent group keys
        const groupProperties = Object.fromEntries(
          params.request.groupKeys.map((groupKey, index) => {
            const col = params.request.rowGroupCols[index];
            const field = col.id;
            return [field, groupKey];
          }),
        );
        return {
          ...rowProperties,
          ...groupProperties,
        };
      });
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersionAndGroupProperties,
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
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", hide: true, rowGroup: true },
    { field: "year", hide: true, rowGroup: true },
    { field: "version" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 280,
      field: "athlete",
    };
  }, []);
  const getRowId = useCallback((params) => {
    const data = params.data;
    const parts = [];
    if (data.country != null) {
      parts.push(data.country);
    }
    if (data.year != null) {
      parts.push(data.year);
    }
    if (data.id != null) {
      parts.push(data.id);
    }
    return parts.join("-");
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    return (
      params.rowNode.key === "Canada" ||
      params.rowNode.key.toString() === "2002"
    );
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // give each data item an ID
        const dataWithId = data.map((d, idx) => ({
          ...d,
          id: idx,
        }));
        allData = dataWithId;
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(allData);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption("serverSideDatasource", datasource);
        beginPeriodicallyModifyingData();
      });
  }, []);

  const onStoreRefreshed = useCallback((event) => {
    console.log("Refresh finished for store with route:", event.route);
  }, []);

  const refreshCache = useCallback((route) => {
    const purge = !!document.querySelector("#purge").checked;
    gridRef.current.api.refreshServerSide({ route: route, purge: purge });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <div>
            Version on server: <span id="version-indicator">1</span>
          </div>
          <button onClick={() => refreshCache(undefined)}>
            Refresh Root Level
          </button>
          <button onClick={() => refreshCache(["Canada"])}>
            Refresh ['Canada'] Group
          </button>
          <button onClick={() => refreshCache(["Canada", "2002"])}>
            Refresh ['Canada', '2002'] Group
          </button>

          <label>
            <input type="checkbox" id="purge" /> Purge
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            getRowId={getRowId}
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            rowModelType={"serverSide"}
            suppressAggFuncInHeader={true}
            onGridReady={onGridReady}
            onStoreRefreshed={onStoreRefreshed}
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
