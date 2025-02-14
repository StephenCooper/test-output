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
import { getFakeServer, registerObserver } from "./fakeServer.jsx";
import {
  ColumnApiModule,
  HighlightChangesModule,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  HighlightChangesModule,
  ColumnApiModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const disable = (id, disabled) => {
  document.querySelector(id).disabled = disabled;
};

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
      }, 300);
    },
  };
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "tradeId" },
    {
      field: "product",
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: "portfolio",
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: "book",
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    { field: "previous", aggFunc: "sum" },
    { field: "current", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 220,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    disable("#stopUpdates", true);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(getFakeServer());
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
    // register interest in data changes
    registerObserver({
      transactionFunc: (t) => params.api.applyServerSideTransactionAsync(t),
      groupedFields: ["product", "portfolio", "book"],
    });
  }, []);

  const onColumnRowGroupChanged = useCallback(
    (event) => {
      const colState = event.api.getColumnState();
      const groupedColumns = colState.filter((state) => state.rowGroup);
      groupedColumns.sort((a, b) => a.rowGroupIndex - b.rowGroupIndex);
      const groupedFields = groupedColumns.map((col) => col.colId);
      registerObserver({
        transactionFunc: (t) =>
          gridRef.current.api.applyServerSideTransactionAsync(t),
        groupedFields: groupedFields.length === 0 ? undefined : groupedFields,
      });
    },
    [registerObserver],
  );

  const startUpdates = useCallback(() => {
    getFakeServer().randomUpdates();
    disable("#startUpdates", true);
    disable("#stopUpdates", false);
  }, [getFakeServer]);

  const stopUpdates = useCallback(() => {
    getFakeServer().stopUpdates();
    disable("#stopUpdates", true);
    disable("#startUpdates", false);
  }, [getFakeServer]);

  const getChildCount = useCallback((data) => {
    return data ? data.childCount : undefined;
  }, []);

  const getRowId = useCallback((params) => {
    let rowId = "";
    if (params.parentKeys && params.parentKeys.length) {
      rowId += params.parentKeys.join("-") + "-";
    }
    const groupCols = params.api.getRowGroupColumns();
    if (groupCols.length > params.level) {
      const thisGroupCol = groupCols[params.level];
      rowId += params.data[thisGroupCol.getColDef().field] + "-";
    }
    if (params.data.tradeId != null) {
      rowId += params.data.tradeId;
    }
    return rowId;
  }, []);

  const isServerSideGroupOpenByDefault = useCallback((params) => {
    const route = params.rowNode.getRoute();
    if (!route) {
      return false;
    }
    const routeAsString = route.join(",");
    return (
      ["Wool", "Wool,Aggressive", "Wool,Aggressive,GL-62502"].indexOf(
        routeAsString,
      ) >= 0
    );
  }, []);

  return (
    <div style={containerStyle}>
      <div className="grid-container">
        <div>
          <button id="startUpdates" onClick={startUpdates}>
            Start Updates
          </button>
          <button id="stopUpdates" onClick={stopUpdates}>
            Stop Updates
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowGroupPanelShow={"always"}
            purgeClosedRowNodes={true}
            rowModelType={"serverSide"}
            getChildCount={getChildCount}
            getRowId={getRowId}
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            onGridReady={onGridReady}
            onColumnRowGroupChanged={onColumnRowGroupChanged}
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
