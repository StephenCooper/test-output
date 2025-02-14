import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [theme]="theme"
    [defaultColDef]="defaultColDef"
    [sideBar]="true"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", hide: true },
    { field: "age", hide: true },
    { field: "country", hide: true },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  theme: Theme | "legacy" = myTheme;
  defaultColDef: ColDef = {
    editable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

const myTheme = themeQuartz.withParams({
  checkboxUncheckedBackgroundColor: "yellow",
  checkboxUncheckedBorderColor: "darkred",
  checkboxCheckedBackgroundColor: "red",
  checkboxCheckedBorderColor: "darkred",
  checkboxCheckedShapeColor: "yellow",
  checkboxCheckedShapeImage: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  },
  checkboxIndeterminateBorderColor: "darkred",
});
