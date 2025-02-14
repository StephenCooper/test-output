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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  NumberEditorModule,
  ValidationModule /* Development Only */,
]);

function generateNewFordData() {
  const newPrice = Math.floor(Math.random() * 100000);
  const newModel = "T-" + Math.floor(Math.random() * 1000);
  return {
    id: "bb",
    make: "Ford",
    model: newModel,
    price: newPrice,
  };
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    { id: "aa", make: "Toyota", model: "Celica", price: 35000 },
    { id: "bb", make: "Ford", model: "Mondeo", price: 32000 },
    { id: "cc", make: "Porsche", model: "Boxster", price: 72000 },
    { id: "dd", make: "BMW", model: "5 Series", price: 59000 },
    { id: "ee", make: "Dodge", model: "Challanger", price: 35000 },
    { id: "ff", make: "Mazda", model: "MX5", price: 28000 },
    { id: "gg", make: "Horse", model: "Outside", price: 99000 },
  ]);
  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      editable: true,
      filter: true,
      enableCellChangeFlash: true,
    };
  }, []);
  const getRowId = useCallback((params) => {
    return params.data.id;
  }, []);

  const updateSort = useCallback(() => {
    gridRef.current.api.refreshClientSideRowModel("sort");
  }, []);

  const updateFilter = useCallback(() => {
    gridRef.current.api.refreshClientSideRowModel("filter");
  }, []);

  const setPriceOnToyota = useCallback(() => {
    const rowNode = gridRef.current.api.getRowNode("aa");
    const newPrice = Math.floor(Math.random() * 100000);
    rowNode.setDataValue("price", newPrice);
  }, []);

  const setDataOnFord = useCallback(() => {
    const rowNode = gridRef.current.api.getRowNode("bb");
    const newData = generateNewFordData();
    rowNode.setData(newData);
  }, []);

  const updateDataOnFord = useCallback(() => {
    const rowNode = gridRef.current.api.getRowNode("bb");
    const newData = generateNewFordData();
    rowNode.updateData(newData);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={setPriceOnToyota}>Set Price on Toyota</button>
          <button onClick={setDataOnFord}>Set Data on Ford</button>
          <button onClick={updateDataOnFord}>Update Data on Ford</button>
          <button onClick={updateSort} style={{ marginLeft: "15px" }}>
            Sort
          </button>
          <button onClick={updateFilter}>Filter</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
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
