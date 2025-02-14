import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
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
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="container">
    <div>
      <button
        (click)="onBtExport()"
        style="margin-bottom: 5px; font-weight: bold"
      >
        Export to Excel
      </button>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [defaultExcelExportParams]="defaultExcelExportParams"
        [excelStyles]="excelStyles"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "company" },
    { field: "url", cellClass: "hyperlinks" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  defaultExcelExportParams: ExcelExportParams = {
    autoConvertFormulas: true,
    processCellCallback: (params) => {
      const field = params.column.getColDef().field;
      return field === "url" ? `=HYPERLINK("${params.value}")` : params.value;
    },
  };
  excelStyles: ExcelStyle[] = [
    {
      id: "hyperlinks",
      font: {
        underline: "Single",
        color: "#358ccb",
      },
    },
  ];
  rowData: any[] | null = [
    { company: "Google", url: "https://www.google.com" },
    { company: "Adobe", url: "https://www.adobe.com" },
    { company: "The New York Times", url: "https://www.nytimes.com" },
    { company: "Twitter", url: "https://www.twitter.com" },
    { company: "StackOverflow", url: "https://stackoverflow.com/" },
    { company: "Reddit", url: "https://www.reddit.com" },
    { company: "GitHub", url: "https://www.github.com" },
    { company: "Microsoft", url: "https://www.microsoft.com" },
    { company: "Gizmodo", url: "https://www.gizmodo.com" },
    { company: "LinkedIN", url: "https://www.linkedin.com" },
  ];

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
