import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { logos } from "./imageUtils";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
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
  template: `<div class="container">
    <div>
      <button class="export" (click)="onBtExport()">Export to Excel</button>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [defaultExcelExportParams]="defaultExcelExportParams"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "country" },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    width: 150,
  };
  defaultExcelExportParams: ExcelExportParams = {
    prependContent: [
      {
        cells: [
          {
            data: {
              type: "String",
              value: logos.AgGrid, // see imageUtils
            },
            mergeAcross: 1,
          },
        ],
      },
    ],
    rowHeight: (params) => (params.rowIndex === 1 ? 82 : 20),
    addImageToCell: (rowIndex, col, value) => {
      if (rowIndex !== 1 || col.getColId() !== "athlete") {
        return;
      }
      return {
        image: {
          id: "logo",
          base64: value,
          imageType: "png",
          width: 295,
          height: 100,
          position: {
            colSpan: 2,
          },
        },
      };
    },
  };
  rowData!: IOlympicData[];

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((response) => response.json())
      .then((data) => params.api.setGridOption("rowData", data));
  }
}
