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
  ClientSideRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    {
      headerName: "Price",
      field: "price",
      valueFormatter: (params) => {
        // params.value: number
        return "£" + params.value;
      },
    },
  ]);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  const context = useMemo(() => {
    return {
      discount: 0.9,
    };
  }, []);
  const getRowId = useCallback((params) => {
    // params.data : ICar
    return params.data.make + params.data.model;
  }, []);

  const onRowSelected = useCallback((event) => {
    // event.data: ICar | undefined
    if (event.data && event.node.isSelected()) {
      const price = event.data.price;
      // event.context: IContext
      const discountRate = event.context.discount;
      console.log("Price with 10% discount:", price * discountRate);
    }
  }, []);

  const onShowSelection = useCallback(() => {
    // api.getSelectedRows() : ICar[]
    const cars = gridRef.current.api.getSelectedRows();
    console.log(
      "Selected cars are",
      cars.map((c) => `${c.make} ${c.model}`),
    );
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onShowSelection}>Log Selected Cars</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection={rowSelection}
            context={context}
            getRowId={getRowId}
            onRowSelected={onRowSelected}
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
