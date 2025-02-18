import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
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
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "£A", field: "a", valueFormatter: currencyFormatter },
    { headerName: "£B", field: "b", valueFormatter: currencyFormatter },
    { headerName: "(A)", field: "a", valueFormatter: bracketsFormatter },
    { headerName: "(B)", field: "b", valueFormatter: bracketsFormatter },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellClass: "number-cell",
  };
  rowData: any[] | null = createRowData();
}

function bracketsFormatter(params: ValueFormatterParams) {
  return "(" + params.value + ")";
}
function currencyFormatter(params: ValueFormatterParams) {
  return "£" + formatNumber(params.value);
}
function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}
function createRowData() {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(((i + 2) * 173456) % 10000),
      b: Math.floor(((i + 7) * 373456) % 10000),
    });
  }
  return rowData;
}
