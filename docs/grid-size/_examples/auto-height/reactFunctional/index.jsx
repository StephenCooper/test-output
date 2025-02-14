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
import "./style.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const createRow = (index) => {
  const makes = ["Toyota", "Ford", "BMW", "Phantom", "Porsche"];
  return {
    id: "D" + (1000 + index),
    make: makes[Math.floor(Math.random() * makes.length)],
    price: Math.floor(Math.random() * 100000),
    val1: Math.floor(Math.random() * 1000),
    val2: Math.floor(Math.random() * 1000),
    val3: Math.floor(Math.random() * 1000),
    val4: Math.floor(Math.random() * 1000),
    val5: Math.floor(Math.random() * 1000),
    val6: Math.floor(Math.random() * 1000),
    val7: Math.floor(Math.random() * 1000),
    val8: Math.floor(Math.random() * 1000),
    val9: Math.floor(Math.random() * 1000),
    val10: Math.floor(Math.random() * 1000),
  };
};

const getData = (count) => {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    rowData.push(createRow(i));
  }
  return rowData;
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData(5));
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Core",
      children: [
        { headerName: "ID", field: "id" },
        { field: "make" },
        { field: "price", filter: "agNumberColumnFilter" },
      ],
    },
    {
      headerName: "Extra",
      children: [
        { field: "val1", filter: "agNumberColumnFilter" },
        { field: "val2", filter: "agNumberColumnFilter" },
        { field: "val3", filter: "agNumberColumnFilter" },
        { field: "val4", filter: "agNumberColumnFilter" },
        { field: "val5", filter: "agNumberColumnFilter" },
        { field: "val6", filter: "agNumberColumnFilter" },
        { field: "val7", filter: "agNumberColumnFilter" },
        { field: "val8", filter: "agNumberColumnFilter" },
        { field: "val9", filter: "agNumberColumnFilter" },
        { field: "val10", filter: "agNumberColumnFilter" },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      enableRowGroup: true,
      enableValue: true,
      filter: true,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);

  const onGridReady = useCallback((params) => {
    document.querySelector("#currentRowCount").textContent = "5";
  }, []);

  const updateRowData = useCallback((rowCount) => {
    setRowData(getData(rowCount));
    document.querySelector("#currentRowCount").textContent = `${rowCount}`;
  }, []);

  const cbFloatingRows = useCallback(() => {
    const show = document.getElementById("floating-rows").checked;
    if (show) {
      gridRef.current.api.setGridOption("pinnedTopRowData", [
        createRow(999),
        createRow(998),
      ]);
      gridRef.current.api.setGridOption("pinnedBottomRowData", [
        createRow(997),
        createRow(996),
      ]);
    } else {
      gridRef.current.api.setGridOption("pinnedTopRowData", undefined);
      gridRef.current.api.setGridOption("pinnedBottomRowData", undefined);
    }
  }, []);

  const setAutoHeight = useCallback(() => {
    gridRef.current.api.setGridOption("domLayout", "autoHeight");
    // auto height will get the grid to fill the height of the contents,
    // so the grid div should have no height set, the height is dynamic.
    document.querySelector("#myGrid").style.height = "";
  }, []);

  const setFixedHeight = useCallback(() => {
    // we could also call setDomLayout() here as normal is the default
    gridRef.current.api.setGridOption("domLayout", "normal");
    // when auto height is off, the grid ahs a fixed height, and then the grid
    // will provide scrollbars if the data does not fit into it.
    document.querySelector("#myGrid").style.height = "400px";
  }, []);

  return (
    <div>
      <div className="test-header">
        <div>
          <button onClick={() => updateRowData(0)}>0 Rows</button>
          <button onClick={() => updateRowData(5)}>5 Rows</button>
          <button onClick={() => updateRowData(50)}>50 Rows</button>
        </div>
        <div>
          <button onClick={setAutoHeight}>Auto Height</button>
          <button onClick={setFixedHeight}>Fixed Height</button>
        </div>
        <div>
          <input
            name="pinned-rows"
            type="checkbox"
            id="floating-rows"
            onClick={cbFloatingRows}
          />
          <label htmlFor="pinned-rows"> Pinned Rows </label>
        </div>
        <div>
          Row Count = <span id="currentRowCount"></span>
        </div>
      </div>

      <div id="myGrid" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout={"autoHeight"}
          popupParent={popupParent}
          onGridReady={onGridReady}
        />
      </div>

      <div
        style={{
          border: "10px solid #eee",
          padding: "10px",
          marginTop: "20px",
        }}
      >
        <p style={{ textAlign: "center" }}>
          This text is under the grid and should move up and down as the height
          of the grid changes.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
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
