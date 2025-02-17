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
import { ModuleRegistry, ValidationModule } from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
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
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      // demonstrating the use of valueGetters
      colId: "country",
      valueGetter: "data.country",
      rowGroup: true,
      hide: true,
    },
    { field: "sport", rowGroup: true, hide: true },
    { field: "year", minWidth: 100 },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
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

  const onBtRetry = useCallback(() => {
    gridRef.current.api.retryServerSideLoads();
  }, []);

  const onBtReset = useCallback(() => {
    gridRef.current.api.refreshServerSide({ purge: true });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <label>
            <input type="checkbox" id="failLoad" /> Make Loads Fail
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={onBtRetry}>Retry Failed Loads</button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={onBtReset}>Reset Entire Grid</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowModelType={"serverSide"}
            maxConcurrentDatasourceRequests={1}
            suppressAggFuncInHeader={true}
            purgeClosedRowNodes={true}
            cacheBlockSize={20}
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
