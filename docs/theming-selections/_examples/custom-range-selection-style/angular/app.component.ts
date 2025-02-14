import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  AllCommunityModule,
  CellSelectionOptions,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [theme]="theme"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [cellSelection]="true"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  theme: Theme | "legacy" = myTheme;
  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
        params.api.addCellRange({
          rowStartIndex: 1,
          rowEndIndex: 5,
          columns: ["age", "country", "year", "date"],
        });
      });
  }
}

const myTheme = themeQuartz.withParams({
  // color and style of border around selection
  rangeSelectionBorderColor: "rgb(193, 0, 97)",
  rangeSelectionBorderStyle: "dashed",
  // background color of selection - you can use a semi-transparent color
  // and it wil overlay on top of the existing cells
  rangeSelectionBackgroundColor: "rgb(255, 0, 128, 0.1)",
  // color used to indicate that data has been copied form the cell range
  rangeSelectionHighlightColor: "rgb(60, 188, 0, 0.3)",
});
