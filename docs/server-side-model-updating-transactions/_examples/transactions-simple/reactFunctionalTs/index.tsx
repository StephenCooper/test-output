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
  RowSelectionOptions,
  ServerSideTransaction,
  ServerSideTransactionResult,
  ValidationModule,
} from "ag-grid-community";
import {
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { data } from "./data";
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

function logResults(
  transaction: ServerSideTransaction,
  result?: ServerSideTransactionResult,
) {
  console.log(
    "[Example] - Applied transaction:",
    transaction,
    "Result:",
    result,
  );
}

function getNewValue() {
  return Math.floor(Math.random() * 100000) + 100;
}

let serverCurrentTradeId = data.length;

function createRow() {
  return {
    portfolio: "Aggressive",
    product: "Aluminium",
    book: "GL-62472",
    tradeId: ++serverCurrentTradeId,
    current: getNewValue(),
  };
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "tradeId" },
    { field: "portfolio" },
    { field: "book" },
    { field: "current" },
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
  const getRowId = useCallback(
    (params: GetRowIdParams) => `${params.data.tradeId}`,
    [],
  );
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "singleRow" };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // setup the fake server
    const server = new FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(server);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
  }, []);

  const addRow = useCallback(() => {
    const selectedRows = gridRef.current!.api.getSelectedNodes();
    if (selectedRows.length === 0) {
      console.warn("[Example] No row selected.");
      return;
    }
    const rowIndex = selectedRows[0].rowIndex;
    const transaction: ServerSideTransaction = {
      addIndex: rowIndex != null ? rowIndex : undefined,
      add: [createRow()],
    };
    const result = gridRef.current!.api.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }, []);

  const updateRow = useCallback(() => {
    const selectedRows = gridRef.current!.api.getSelectedNodes();
    if (selectedRows.length === 0) {
      console.warn("[Example] No row selected.");
      return;
    }
    const transaction: ServerSideTransaction = {
      update: [{ ...selectedRows[0].data, current: getNewValue() }],
    };
    const result = gridRef.current!.api.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }, []);

  const removeRow = useCallback(() => {
    const selectedRows = gridRef.current!.api.getSelectedNodes();
    if (selectedRows.length === 0) {
      console.warn("[Example] No row selected.");
      return;
    }
    const transaction: ServerSideTransaction = {
      remove: [selectedRows[0].data],
    };
    const result = gridRef.current!.api.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={addRow}>Add Above Selected</button>
          <button onClick={updateRow}>Update Selected</button>
          <button onClick={removeRow}>Remove Selected</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            getRowId={getRowId}
            rowSelection={rowSelection}
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
(window as any).tearDownExample = () => root.unmount();
