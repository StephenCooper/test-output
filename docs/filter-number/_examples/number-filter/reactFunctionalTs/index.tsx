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
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  INumberFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const numberValueFormatter = function (params: ValueFormatterParams) {
  return params.value.toFixed(2);
};

const saleFilterParams: INumberFilterParams = {
  allowedCharPattern: "\\d\\-\\,\\$",
  numberParser: (text: string | null) => {
    return text == null
      ? null
      : parseFloat(text.replace(",", ".").replace("$", ""));
  },
  numberFormatter: (value: number | null) => {
    return value == null ? null : value.toString().replace(".", ",");
  },
};

const saleValueFormatter = function (params: ValueFormatterParams) {
  const formatted = params.value.toFixed(2).replace(".", ",");
  if (formatted.indexOf("-") === 0) {
    return "-$" + formatted.slice(1);
  }
  return "$" + formatted;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "sale",
      headerName: "Sale ($)",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      valueFormatter: numberValueFormatter,
    },
    {
      field: "sale",
      headerName: "Sale",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      filterParams: saleFilterParams,
      valueFormatter: saleValueFormatter,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
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
