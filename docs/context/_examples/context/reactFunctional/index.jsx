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
  HighlightChangesModule,
  ModuleRegistry,
  RenderApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RenderApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const gbpFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

const eurFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const currencyCellRenderer = (params) => {
  switch (params.value.currency) {
    case "EUR":
      return eurFormatter.format(params.value.amount);
    case "USD":
      return usdFormatter.format(params.value.amount);
    case "GBP":
      return gbpFormatter.format(params.value.amount);
  }
  return params.value.amount;
};

const reportingCurrencyValueGetter = (params) => {
  // Rates taken from google at time of writing
  const exchangeRates = {
    EUR: {
      GBP: 0.72,
      USD: 1.08,
    },
    GBP: {
      EUR: 1.29,
      USD: 1.5,
    },
    USD: {
      GBP: 0.67,
      EUR: 0.93,
    },
  };
  const price = params.data[params.colDef.field];
  const reportingCurrency = params.context.reportingCurrency;
  const fxRateSet = exchangeRates[reportingCurrency];
  const fxRate = fxRateSet[price.currency];
  let priceInReportingCurrency;
  if (fxRate) {
    priceInReportingCurrency = price.amount * fxRate;
  } else {
    priceInReportingCurrency = price.amount;
  }
  const result = {
    currency: reportingCurrency,
    amount: priceInReportingCurrency,
  };
  return result;
};

const getData = () => {
  return [
    { product: "Product 1", price: { currency: "EUR", amount: 644 } },
    { product: "Product 2", price: { currency: "EUR", amount: 354 } },
    { product: "Product 3", price: { currency: "GBP", amount: 429 } },
    { product: "Product 4", price: { currency: "GBP", amount: 143 } },
    { product: "Product 5", price: { currency: "USD", amount: 345 } },
    { product: "Product 6", price: { currency: "USD", amount: 982 } },
  ];
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "product" },
    { headerName: "Currency", field: "price.currency" },
    {
      headerName: "Price Local",
      field: "price",
      cellRenderer: currencyCellRenderer,
      cellDataType: false,
    },
    {
      headerName: "Report Price",
      field: "price",
      cellRenderer: currencyCellRenderer,
      valueGetter: reportingCurrencyValueGetter,
      headerValueGetter: "ctx.reportingCurrency",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      enableCellChangeFlash: true,
    };
  }, []);
  const context = useMemo(() => {
    return {
      reportingCurrency: "EUR",
    };
  }, []);

  const currencyChanged = useCallback(() => {
    const value = document.getElementById("currency").value;
    gridRef.current.api.setGridOption("context", { reportingCurrency: value });
    gridRef.current.api.refreshCells();
    gridRef.current.api.refreshHeader();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ height: "10%" }}>
        <select id="currency" onChange={currencyChanged}>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
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
