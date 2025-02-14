import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ICellRendererParams,
  ModuleRegistry,
  RenderApiModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RenderApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="height: 10%">
      <select id="currency" (change)="currencyChanged()">
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="USD">USD</option>
      </select>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 90%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [context]="context"
      (gridReady)="onGridReady($event)"
    /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
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
  ];
  defaultColDef: ColDef = {
    flex: 1,
    enableCellChangeFlash: true,
  };
  rowData: any[] | null = getData();
  context: any = {
    reportingCurrency: "EUR",
  };

  currencyChanged() {
    const value = (document.getElementById("currency") as any).value;
    this.gridApi.setGridOption("context", { reportingCurrency: value });
    this.gridApi.refreshCells();
    this.gridApi.refreshHeader();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

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
const currencyCellRenderer = (params: ICellRendererParams) => {
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
function reportingCurrencyValueGetter(params: ValueGetterParams) {
  // Rates taken from google at time of writing
  const exchangeRates: Record<string, any> = {
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
  const price = params.data[params.colDef.field!];
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
}
function getData() {
  return [
    { product: "Product 1", price: { currency: "EUR", amount: 644 } },
    { product: "Product 2", price: { currency: "EUR", amount: 354 } },
    { product: "Product 3", price: { currency: "GBP", amount: 429 } },
    { product: "Product 4", price: { currency: "GBP", amount: 143 } },
    { product: "Product 5", price: { currency: "USD", amount: 345 } },
    { product: "Product 6", price: { currency: "USD", amount: 982 } },
  ];
}
