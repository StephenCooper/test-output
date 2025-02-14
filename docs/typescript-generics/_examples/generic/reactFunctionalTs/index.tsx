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
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowSelectedEvent,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface ICar {
  make: string;
  model: string;
  price: number;
}
interface IDiscountRate {
  discount: number;
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact<ICar>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<ICar[]>([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    {
      headerName: "Price",
      field: "price",
      valueFormatter: (params: ValueFormatterParams<ICar, number>) => {
        // params.value: number
        return "£" + params.value;
      },
    },
  ]);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  const context = useMemo(() => {
    return {
      discount: 0.9,
    } as IDiscountRate;
  }, []);
  const getRowId = useCallback((params: GetRowIdParams<ICar>) => {
    // params.data : ICar
    return params.data.make + params.data.model;
  }, []);

  const onRowSelected = useCallback(
    (event: RowSelectedEvent<ICar, IDiscountRate>) => {
      // event.data: ICar | undefined
      if (event.data && event.node.isSelected()) {
        const price = event.data.price;
        // event.context: IContext
        const discountRate = event.context.discount;
        console.log("Price with 10% discount:", price * discountRate);
      }
    },
    [],
  );

  const onShowSelection = useCallback(() => {
    // api.getSelectedRows() : ICar[]
    const cars: ICar[] = gridRef.current!.api.getSelectedRows();
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
          <AgGridReact<ICar>
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
