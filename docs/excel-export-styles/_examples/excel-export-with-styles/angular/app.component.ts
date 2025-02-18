import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
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
  CellStyleModule,
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
        [excelStyles]="excelStyles"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 200 },
    {
      field: "age",
      cellClassRules: {
        greenBackground: (params) => {
          return params.value < 23;
        },
        redFont: (params) => {
          return params.value < 20;
        },
      },
    },
    {
      field: "country",
      minWidth: 200,
      cellClassRules: {
        redFont: (params) => {
          return params.value === "United States";
        },
      },
    },
    {
      headerName: "Group",
      valueGetter: "data.country.charAt(0)",
      cellClass: ["redFont", "greenBackground"],
    },
    {
      field: "year",
      cellClassRules: {
        notInExcel: (params) => {
          return true;
        },
      },
    },
    { field: "sport", minWidth: 150 },
  ];
  defaultColDef: ColDef = {
    cellClassRules: {
      darkGreyBackground: (params: CellClassParams) => {
        return (params.node.rowIndex || 0) % 2 == 0;
      },
    },
    filter: true,
    minWidth: 100,
    flex: 1,
  };
  excelStyles: ExcelStyle[] = [
    {
      id: "cell",
      alignment: {
        vertical: "Center",
      },
    },
    {
      id: "greenBackground",
      interior: {
        color: "#b5e6b5",
        pattern: "Solid",
      },
    },
    {
      id: "redFont",
      font: {
        fontName: "Calibri Light",
        underline: "Single",
        italic: true,
        color: "#BB0000",
      },
    },
    {
      id: "darkGreyBackground",
      interior: {
        color: "#888888",
        pattern: "Solid",
      },
      font: {
        fontName: "Calibri Light",
        color: "#ffffff",
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
