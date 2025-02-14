import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import "./style.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
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
    class="ag-theme-quartz"
    [columnDefs]="columnDefs"
    [theme]="theme"
    [loadThemeGoogleFonts]="true"
    [defaultColDef]="defaultColDef"
    [sideBar]="true"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
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
  // the grid will load these fonts for you if loadThemeGoogleFonts=true
  fontFamily: { googleFont: "Delius" },
  headerFontFamily: { googleFont: "Sixtyfour Convergence" },
  cellFontFamily: { googleFont: "Turret Road" },
  // these fonts are awesome, so they should be large too
  fontSize: 20,
  headerFontSize: 25,
});
