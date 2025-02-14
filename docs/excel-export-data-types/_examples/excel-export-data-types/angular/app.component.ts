import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <button (click)="onBtExport()" style="font-weight: bold">
        Export to Excel
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [excelStyles]="excelStyles"
      [popupParent]="popupParent"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { headerName: "provided", field: "rawValue" },
    { headerName: "number", field: "rawValue", cellClass: "numberType" },
    { headerName: "currency", field: "rawValue", cellClass: "currencyFormat" },
    { headerName: "boolean", field: "rawValue", cellClass: "booleanType" },
    {
      headerName: "Negative",
      field: "negativeValue",
      cellClass: "negativeInBrackets",
    },
    { headerName: "string", field: "rawValue", cellClass: "stringType" },
    {
      headerName: "Date",
      field: "dateValue",
      cellClass: "dateType",
      minWidth: 220,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  rowData: any[] | null = [
    {
      rawValue: 1,
      negativeValue: -10,
      dateValue: "2009-04-20T00:00:00.000",
    },
  ];
  excelStyles: ExcelStyle[] = [
    {
      id: "numberType",
      numberFormat: {
        format: "0",
      },
    },
    {
      id: "currencyFormat",
      numberFormat: {
        format: "#,##0.00 €",
      },
    },
    {
      id: "negativeInBrackets",
      numberFormat: {
        format: "$[blue] #,##0;$ [red](#,##0)",
      },
    },
    {
      id: "booleanType",
      dataType: "Boolean",
    },
    {
      id: "stringType",
      dataType: "String",
    },
    {
      id: "dateType",
      dataType: "DateTime",
    },
  ];
  popupParent: HTMLElement | null = document.body;

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
