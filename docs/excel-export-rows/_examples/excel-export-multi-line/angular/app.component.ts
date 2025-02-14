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
  ICellRendererParams,
  ModuleRegistry,
  RowAutoHeightModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
  CellStyleModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { MultilineCellRenderer } from "./multiline-cell-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, MultilineCellRenderer],
  template: `<div class="container">
    <div>
      <button (click)="onBtExport()" style="margin: 5px 0px; font-weight: bold">
        Export to Excel
      </button>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowData]="rowData"
        [excelStyles]="excelStyles"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "address" },
    {
      headerName: "Custom column",
      autoHeight: true,
      valueGetter: (param) => {
        return param.data.col1 + "\n" + param.data.col2;
      },
      cellRenderer: MultilineCellRenderer,
    },
  ];
  defaultColDef: ColDef = {
    cellClass: "multiline",
    minWidth: 100,
    flex: 1,
  };
  rowData: any[] | null = [
    {
      address:
        "1197 Thunder Wagon Common,\nCataract, RI, \n02987-1016, US, \n(401) 747-0763",
      col1: "abc",
      col2: "xyz",
    },
    {
      address:
        "3685 Rocky Glade, Showtucket, NU, \nX1E-9I0, CA, \n(867) 371-4215",
      col1: "abc",
      col2: "xyz",
    },
    {
      address:
        "3235 High Forest, Glen Campbell, MS, \n39035-6845, US, \n(601) 638-8186",
      col1: "abc",
      col2: "xyz",
    },
    {
      address:
        "2234 Sleepy Pony Mall , Drain, DC, \n20078-4243, US, \n(202) 948-3634",
      col1: "abc",
      col2: "xyz",
    },
  ];
  excelStyles: ExcelStyle[] = [
    {
      id: "multiline",
      alignment: {
        wrapText: true,
      },
    },
  ];

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
