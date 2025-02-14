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
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideGetRowsParams,
  ModuleRegistry,
  RowModelType,
  ServerSideTransaction,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { data, dataObservers, randomUpdates } from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any) {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
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
      }, 300);
    },
  };
}

let interval: any;

function disable(id: string, disabled: boolean) {
  document.querySelector<HTMLInputElement>(id)!.disabled = disabled;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "tradeId" },
    { field: "portfolio" },
    { field: "book" },
    { field: "previous" },
    { field: "current" },
    {
      field: "lastUpdated",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params) => {
        const ts = params.data!.lastUpdated;
        if (ts) {
          const hh_mm_ss = ts.toLocaleString().split(" ")[1];
          const SSS = ts.getMilliseconds();
          return `${hh_mm_ss}:${SSS}`;
        }
        return "";
      },
    },
    { field: "updateCount" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 220,
    };
  }, []);
  const getRowId = useCallback((params: GetRowIdParams) => {
    let rowId = "";
    if (params.parentKeys && params.parentKeys.length) {
      rowId += params.parentKeys.join("-") + "-";
    }
    if (params.data.tradeId != null) {
      rowId += params.data.tradeId;
    }
    return rowId;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    disable("#stopUpdates", true);
    // setup the fake server
    const server = FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(server);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
    // register interest in data changes
    dataObservers.push((t: ServerSideTransaction) => {
      params.api.applyServerSideTransactionAsync(t);
    });
  }, []);

  const startUpdates = useCallback(() => {
    interval = setInterval(
      () => randomUpdates({ numUpdate: 10, numAdd: 1, numRemove: 1 }),
      10,
    );
    disable("#stopUpdates", false);
    disable("#startUpdates", true);
  }, [randomUpdates]);

  const stopUpdates = useCallback(() => {
    if (interval !== undefined) {
      clearInterval(interval);
    }
    disable("#stopUpdates", true);
    disable("#startUpdates", false);
  }, [interval]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button id="startUpdates" onClick={startUpdates}>
            Start Updates
          </button>
          <button id="stopUpdates" onClick={stopUpdates}>
            Stop Updates
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            getRowId={getRowId}
            asyncTransactionWaitMillis={1000}
            rowModelType={"serverSide"}
            onGridReady={onGridReady}
          />
        </div>
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
