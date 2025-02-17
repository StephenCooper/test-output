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
  ValidationModule,
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
import { useFetchJson } from "./useFetchJson";

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
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country" },
    { field: "year" },
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
          <button onClick={() => refreshCache(undefined)}>Refresh Rows</button>

          <label>
            <input type="checkbox" id="purge" /> Purge
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            getRowId={getRowId}
            rowModelType={"serverSide"}
            suppressAggFuncInHeader={true}
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
