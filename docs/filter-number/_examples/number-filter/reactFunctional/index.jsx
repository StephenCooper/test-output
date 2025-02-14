"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const numberValueFormatter = function (params) {
  return params.value.toFixed(2);
};

const saleFilterParams = {
  allowedCharPattern: "\\d\\-\\,\\$",
  numberParser: (text) => {
    return text == null
      ? null
      : parseFloat(text.replace(",", ".").replace("$", ""));
  },
  numberFormatter: (value) => {
    return value == null ? null : value.toString().replace(".", ",");
  },
};

const saleValueFormatter = function (params) {
  const formatted = params.value.toFixed(2).replace(".", ",");
  if (formatted.indexOf("-") === 0) {
    return "-$" + formatted.slice(1);
  }
  return "$" + formatted;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
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
  const defaultColDef = useMemo(() => {
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();
