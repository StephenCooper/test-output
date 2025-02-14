import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilter,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
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
  template: `<div class="example-wrapper">
    <div class="example-header">
      <button (click)="getMiniFilterText()">Get Mini Filter Text</button>
      <button (click)="saveMiniFilterText()">Save Mini Filter Text</button>
      <button (click)="restoreMiniFilterText()">
        Restore Mini Filter Text
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [{ field: "athlete", filter: "agSetColumnFilter" }];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  getMiniFilterText() {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>("athlete")
      .then((athleteFilter) => {
        console.log(athleteFilter!.getMiniFilter());
      });
  }

  saveMiniFilterText() {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>("athlete")
      .then((athleteFilter) => {
        savedMiniFilterText = athleteFilter!.getMiniFilter();
      });
  }

  restoreMiniFilterText() {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>("athlete")
      .then((athleteFilter) => {
        athleteFilter!.setMiniFilter(savedMiniFilterText);
      });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    params.api.getToolPanelInstance("filters")!.expandFilters();

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

let savedMiniFilterText: string | null = "";
