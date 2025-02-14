import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellClassParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="page-wrapper">
    <div>
      <button
        (click)="onBtnExportDataAsExcel()"
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
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: "athlete" },
    { field: "sport", minWidth: 150 },
    {
      headerName: "Medals",
      children: [
        { field: "gold", headerClass: "gold-header" },
        { field: "silver", headerClass: "silver-header" },
        { field: "bronze", headerClass: "bronze-header" },
      ],
    },
  ];
  defaultColDef: ColDef = {
    filter: true,
    minWidth: 100,
    flex: 1,
  };
  defaultExcelExportParams: ExcelExportParams = {
    headerRowHeight: 30,
  };
  excelStyles: ExcelStyle[] = [
    {
      id: "header",
      alignment: {
        vertical: "Center",
      },
      interior: {
        color: "#f8f8f8",
        pattern: "Solid",
        patternColor: undefined,
      },
      borders: {
        borderBottom: {
          color: "#ffab00",
          lineStyle: "Continuous",
          weight: 1,
        },
      },
    },
    {
      id: "headerGroup",
      font: {
        bold: true,
      },
    },
    {
      id: "gold-header",
      interior: {
        color: "#E4AB11",
        pattern: "Solid",
      },
    },
    {
      id: "silver-header",
      interior: {
        color: "#bbb4bb",
        pattern: "Solid",
      },
    },
    {
      id: "bronze-header",
      interior: {
        color: "#be9088",
        pattern: "Solid",
      },
    },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtnExportDataAsExcel() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
