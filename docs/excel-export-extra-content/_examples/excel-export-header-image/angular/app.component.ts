import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
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
import { agGridLogo } from "./logo";
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
        [popupParent]="popupParent"
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
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    filter: true,
    minWidth: 100,
    flex: 1,
  };
  popupParent: HTMLElement | null = document.body;
  defaultExcelExportParams: ExcelExportParams = {
    headerFooterConfig: {
      all: {
        header: [
          {
            value: "&[Picture]",
            image: {
              id: "logo",
              base64: agGridLogo,
              width: 720,
              height: 250,
              imageType: "png",
              recolor: "Grayscale",
            },
            position: "Center",
          },
        ],
      },
    },
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe(
        (data) =>
          (this.rowData = data.filter((rec: any) => rec.country != null)),
      );
  }
}
