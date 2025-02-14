import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="container">
    <div class="columns">
      <div>
        <button
          (click)="onBtExport()"
          style="font-weight: bold; margin-bottom: 5px"
        >
          Export to Excel
        </button>
      </div>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [defaultColDef]="defaultColDef"
        [columnDefs]="columnDefs"
        [excelStyles]="excelStyles"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  defaultColDef: ColDef = {
    filter: true,
    minWidth: 100,
    flex: 1,
  };
  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold", hide: true },
    { field: "silver", hide: true },
    { field: "bronze", hide: true },
    { field: "total", hide: true },
  ];
  excelStyles: ExcelStyle[] = [
    {
      id: "coverHeading",
      font: {
        size: 26,
        bold: true,
      },
    },
    {
      id: "coverText",
      font: {
        size: 14,
      },
    },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtExport() {
    const performExport = async () => {
      const spreadsheets = [];
      //set a filter condition ensuring no records are returned so only the header content is exported
      await this.gridApi.setColumnFilterModel("athlete", {
        values: [],
      });
      this.gridApi.onFilterChanged();
      //export custom content for cover page
      spreadsheets.push(
        this.gridApi.getSheetDataForExcel({
          prependContent: [
            {
              cells: [
                {
                  styleId: "coverHeading",
                  mergeAcross: 3,
                  data: { value: "AG Grid", type: "String" },
                },
              ],
            },
            {
              cells: [
                {
                  styleId: "coverHeading",
                  mergeAcross: 3,
                  data: { value: "", type: "String" },
                },
              ],
            },
            {
              cells: [
                {
                  styleId: "coverText",
                  mergeAcross: 3,
                  data: {
                    value:
                      "Data shown lists Olympic medal winners for years 2000-2012",
                    type: "String",
                  },
                },
              ],
            },
            {
              cells: [
                {
                  styleId: "coverText",
                  data: {
                    value:
                      "This data includes a row for each participation record - athlete name, country, year, sport, count of gold, silver, bronze medals won during the sports event",
                    type: "String",
                  },
                },
              ],
            },
          ],
          processHeaderCallback: () => "",
          sheetName: "cover",
        })!,
      );
      //remove filter condition set above so all the grid data can be exported on a separate sheet
      await this.gridApi.setColumnFilterModel("athlete", null);
      this.gridApi.onFilterChanged();
      spreadsheets.push(this.gridApi.getSheetDataForExcel()!);
      this.gridApi.exportMultipleSheetsAsExcel({
        data: spreadsheets,
        fileName: "ag-grid.xlsx",
      });
    };
    performExport();
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
