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
  ColumnApiModule,
  ColumnRowGroupChangedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideGetRowsParams,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ServerSideTransaction,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { getFakeServer, registerObserver } from "./fakeServer";
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

function disable(id: string, disabled: boolean) {
  document.querySelector<HTMLInputElement>(id)!.disabled = disabled;
}

function getServerSideDatasource(server: any) {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
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
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
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

  const onGridReady = useCallback((params: GridReadyEvent) => {
    disable("#stopUpdates", true);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(getFakeServer());
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
    // register interest in data changes
    registerObserver({
      transactionFunc: (t: ServerSideTransaction) =>
        params.api.applyServerSideTransactionAsync(t),
      groupedFields: ["product", "portfolio", "book"],
    });
  }, []);

  const onColumnRowGroupChanged = useCallback(
    (event: ColumnRowGroupChangedEvent) => {
      const colState = event.api.getColumnState();
      const groupedColumns = colState.filter((state) => state.rowGroup);
      groupedColumns.sort((a, b) => a.rowGroupIndex! - b.rowGroupIndex!);
      const groupedFields = groupedColumns.map((col) => col.colId);
      registerObserver({
        transactionFunc: (t: ServerSideTransaction) =>
          gridRef.current!.api.applyServerSideTransactionAsync(t),
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

  const getChildCount = useCallback((data: any) => {
    return data ? data.childCount : undefined;
  }, []);

  const getRowId = useCallback((params: GetRowIdParams) => {
    let rowId = "";
    if (params.parentKeys && params.parentKeys.length) {
      rowId += params.parentKeys.join("-") + "-";
    }
    const groupCols = params.api.getRowGroupColumns();
    if (groupCols.length > params.level) {
      const thisGroupCol = groupCols[params.level];
      rowId += params.data[thisGroupCol.getColDef().field!] + "-";
    }
    if (params.data.tradeId != null) {
      rowId += params.data.tradeId;
    }
    return rowId;
  }, []);

  const isServerSideGroupOpenByDefault = useCallback(
    (params: IsServerSideGroupOpenByDefaultParams) => {
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
    },
    [],
  );

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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();
