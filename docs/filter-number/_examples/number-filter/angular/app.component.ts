import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
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

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
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
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  rowData: any[] | null = getData();
}

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
