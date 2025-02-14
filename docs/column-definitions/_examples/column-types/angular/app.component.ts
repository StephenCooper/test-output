import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface SalesRecord {
  productName: string;
  boughtPrice: number;
  soldPrice: number;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="height: 100%; box-sizing: border-box">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnTypes]="columnTypes"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
    />
  </div> `,
})
export class AppComponent {
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    currency: {
      width: 150,
      valueFormatter: currencyFormatter,
    },
    shaded: {
      cellClass: "shaded-class",
    },
  };
  columnDefs: ColDef[] = [
    { field: "productName" },
    // uses properties from currency type
    { field: "boughtPrice", type: "currency" },
    // uses properties from currency AND shaded types
    { field: "soldPrice", type: ["currency", "shaded"] },
  ];
  rowData: SalesRecord[] | null = [
    { productName: "Lamp", boughtPrice: 100, soldPrice: 200 },
    { productName: "Chair", boughtPrice: 150, soldPrice: 300 },
    { productName: "Desk", boughtPrice: 200, soldPrice: 400 },
  ];
}

function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
