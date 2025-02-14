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

const UPDATE_COUNT = 500;

function numberCellFormatter(params) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
      field: "current",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "previous",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
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
      field: "submitterID",
      width: 200,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
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
    params.api.setGridOption("rowData", globalRowData);
  }, []);

  const onNormalUpdate = useCallback(() => {
    const startMillis = new Date().getTime();
    setMessage("Running Transaction");
    for (let i = 0; i < UPDATE_COUNT; i++) {
      setTimeout(() => {
        // pick one index at random
        const index = Math.floor(Math.random() * globalRowData.length);
        const itemToUpdate = globalRowData[index];
        const newItem = copyObject(itemToUpdate);
        // copy previous to current value
        newItem.previous = newItem.current;
        // then create new current value
        newItem.current = Math.floor(Math.random() * 100000) + 100;
        // do normal update. update is done before method returns
        gridRef.current.api.applyTransaction({ update: [newItem] });
      }, 0);
    }
    // print message in next VM turn to allow browser to refresh first.
    // we assume the browser executes the timeouts in order they are created,
    // so this timeout executes after all the update timeouts created above.
    setTimeout(() => {
      const endMillis = new Date().getTime();
      const duration = endMillis - startMillis;
      setMessage("Transaction took " + duration.toLocaleString() + "ms");
    }, 0);
    function setMessage(msg) {
      const eMessage = document.querySelector("#eMessage");
      eMessage.textContent = msg;
    }
  }, [globalRowData]);

  const onAsyncUpdate = useCallback(() => {
    const startMillis = new Date().getTime();
    setMessage("Running Async");
    let updatedCount = 0;
    for (let i = 0; i < UPDATE_COUNT; i++) {
      setTimeout(() => {
        // pick one index at random
        const index = Math.floor(Math.random() * globalRowData.length);
        const itemToUpdate = globalRowData[index];
        const newItem = copyObject(itemToUpdate);
        // copy previous to current value
        newItem.previous = newItem.current;
        // then create new current value
        newItem.current = Math.floor(Math.random() * 100000) + 100;
        // update using async method. passing the callback is
        // optional, we are doing it here so we know when the update
        // was processed by the grid.
        gridRef.current.api.applyTransactionAsync(
          { update: [newItem] },
          resultCallback,
        );
      }, 0);
    }
    function resultCallback() {
      updatedCount++;
      if (updatedCount === UPDATE_COUNT) {
        // print message in next VM turn to allow browser to refresh
        setTimeout(() => {
          const endMillis = new Date().getTime();
          const duration = endMillis - startMillis;
          setMessage("Async took " + duration.toLocaleString() + "ms");
        }, 0);
      }
    }
    function setMessage(msg) {
      const eMessage = document.querySelector("#eMessage");
      eMessage.textContent = msg;
    }
  }, [globalRowData]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={onNormalUpdate}>Normal Update</button>
          <button onClick={onAsyncUpdate}>Async Update</button>
          <span id="eMessage"></span>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            suppressAggFuncInHeader={true}
            rowGroupPanelShow={"always"}
            getRowId={getRowId}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
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
