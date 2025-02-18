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
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
import { getData, globalRowData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

const UPDATE_COUNT = 20;

function numberCellFormatter(params) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function startFeed(api) {
  let count = 1;
  setInterval(() => {
    const thisCount = count++;
    const updatedIndexes = {};
    const newItems = [];
    for (let i = 0; i < UPDATE_COUNT; i++) {
      // pick one index at random
      const index = Math.floor(Math.random() * globalRowData.length);
      // dont do same index twice, otherwise two updates for same row in one transaction
      if (updatedIndexes[index]) {
        continue;
      }
      const itemToUpdate = globalRowData[index];
      const newItem = copyObject(itemToUpdate);
      // copy previous to current value
      newItem.previous = newItem.current;
      // then create new current value
      newItem.current = Math.floor(Math.random() * 100000) + 100;
      newItems.push(newItem);
    }
    const resultCallback = () => {
      console.log("transactionApplied() - " + thisCount);
    };
    api.applyTransactionAsync({ update: newItems }, resultCallback);
    console.log("applyTransactionAsync() - " + thisCount);
  }, 500);
}

// makes a copy of the original and merges in the new values
function copyObject(object) {
  // start with new object
  const newObject = {};
  // copy in the old values
  Object.keys(object).forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    // these are the row groups, so they are all hidden (they are show in the group column)
    {
      headerName: "Product",
      field: "product",
      enableRowGroup: true,
      rowGroupIndex: 0,
      hide: true,
    },
    {
      headerName: "Portfolio",
      field: "portfolio",
      enableRowGroup: true,
      rowGroupIndex: 1,
      hide: true,
    },
    {
      headerName: "Book",
      field: "book",
      enableRowGroup: true,
      rowGroupIndex: 2,
      hide: true,
    },
    { headerName: "Trade", field: "trade", width: 100 },
    // all the other columns (visible and not grouped)
    {
      headerName: "Current",
      field: "current",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Previous",
      field: "previous",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Deal Type",
      field: "dealType",
      enableRowGroup: true,
    },
    {
      headerName: "Bid",
      field: "bidFlag",
      enableRowGroup: true,
      width: 100,
    },
    {
      headerName: "PL 1",
      field: "pl1",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "PL 2",
      field: "pl2",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Gain-DX",
      field: "gainDx",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "SX / PX",
      field: "sxPx",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "99 Out",
      field: "_99Out",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Submitter ID",
      field: "submitterID",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Submitted Deal ID",
      field: "submitterDealID",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
  ]);
  const getRowId = useCallback((params) => String(params.data.trade), []);
  const defaultColDef = useMemo(() => {
    return {
      width: 120,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      width: 250,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    getData();
    setRowData(globalRowData);
    startFeed(params.api);
  }, []);

  const onAsyncTransactionsFlushed = useCallback((e) => {
    console.log(
      "========== onAsyncTransactionsFlushed: applied " +
        e.results.length +
        " transactions",
    );
  }, []);

  const onFlushTransactions = useCallback(() => {
    gridRef.current.api.flushAsyncTransactions();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={onFlushTransactions}>Flush Transactions</button>
          <span id="eMessage"></span>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            suppressAggFuncInHeader={true}
            rowGroupPanelShow={"always"}
            asyncTransactionWaitMillis={4000}
            getRowId={getRowId}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            onGridReady={onGridReady}
            onAsyncTransactionsFlushed={onAsyncTransactionsFlushed}
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
