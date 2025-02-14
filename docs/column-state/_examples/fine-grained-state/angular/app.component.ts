import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <table>
        <tbody>
          <tr>
            <td>Sort:</td>
            <td>
              <button (click)="onBtSortAthlete()">Sort Athlete</button>
              <button (click)="onBtSortCountryThenSportClearOthers()">
                Sort Country, then Sport - Clear Others
              </button>
              <button (click)="onBtClearAllSorting()">Clear All Sorting</button>
            </td>
          </tr>
          <tr>
            <td>Column Order:</td>
            <td>
              <button (click)="onBtOrderColsMedalsFirst()">
                Show Medals First
              </button>
              <button (click)="onBtOrderColsMedalsLast()">
                Show Medals Last
              </button>
            </td>
          </tr>
          <tr>
            <td>Column Visibility:</td>
            <td>
              <button (click)="onBtHideMedals()">Hide Medals</button>
              <button (click)="onBtShowMedals()">Show Medals</button>
            </td>
          </tr>
          <tr>
            <td>Row Group:</td>
            <td>
              <button (click)="onBtRowGroupCountryThenSport()">
                Group Country then Sport
              </button>
              <button (click)="onBtRemoveCountryRowGroup()">
                Remove Country
              </button>
              <button (click)="onBtClearAllRowGroups()">
                Clear All Groups
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [sideBar]="sideBar"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [pivotPanelShow]="pivotPanelShow"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    width: 150,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ["columns"],
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  pivotPanelShow: "always" | "onlyWhenPivoting" | "never" = "always";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtSortAthlete() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", sort: "asc" }],
    });
  }

  onBtSortCountryThenSportClearOthers() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "country", sort: "asc", sortIndex: 0 },
        { colId: "sport", sort: "asc", sortIndex: 1 },
      ],
      defaultState: { sort: null },
    });
  }

  onBtClearAllSorting() {
    this.gridApi.applyColumnState({
      defaultState: { sort: null },
    });
  }

  onBtRowGroupCountryThenSport() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "country", rowGroupIndex: 0 },
        { colId: "sport", rowGroupIndex: 1 },
      ],
      defaultState: { rowGroup: false },
    });
  }

  onBtRemoveCountryRowGroup() {
    this.gridApi.applyColumnState({
      state: [{ colId: "country", rowGroup: false }],
    });
  }

  onBtClearAllRowGroups() {
    this.gridApi.applyColumnState({
      defaultState: { rowGroup: false },
    });
  }

  onBtOrderColsMedalsFirst() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
        { colId: "total" },
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "year" },
        { colId: "date" },
      ],
      applyOrder: true,
    });
  }

  onBtOrderColsMedalsLast() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "year" },
        { colId: "date" },
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
        { colId: "total" },
      ],
      applyOrder: true,
    });
  }

  onBtHideMedals() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "gold", hide: true },
        { colId: "silver", hide: true },
        { colId: "bronze", hide: true },
        { colId: "total", hide: true },
      ],
    });
  }

  onBtShowMedals() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "gold", hide: false },
        { colId: "silver", hide: false },
        { colId: "bronze", hide: false },
        { colId: "total", hide: false },
      ],
    });
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
