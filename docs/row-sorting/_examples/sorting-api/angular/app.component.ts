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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <div>
        <button (click)="sortByAthleteAsc()">Athlete Ascending</button>
        <button (click)="sortByAthleteDesc()">Athlete Descending</button>
        <button (click)="sortByCountryThenSport()">Country, then Sport</button>
        <button (click)="sortBySportThenCountry()">Sport, then Country</button>
      </div>
      <div style="margin-top: 0.25rem">
        <button (click)="clearSort()">Clear Sort</button>
        <button (click)="saveSort()">Save Sort</button>
        <button (click)="restoreFromSave()">Restore from Save</button>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age", width: 90 },
    { field: "country" },
    { field: "year", width: 90 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  sortByAthleteAsc() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", sort: "asc" }],
      defaultState: { sort: null },
    });
  }

  sortByAthleteDesc() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", sort: "desc" }],
      defaultState: { sort: null },
    });
  }

  sortByCountryThenSport() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "country", sort: "asc", sortIndex: 0 },
        { colId: "sport", sort: "asc", sortIndex: 1 },
      ],
      defaultState: { sort: null },
    });
  }

  sortBySportThenCountry() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "country", sort: "asc", sortIndex: 1 },
        { colId: "sport", sort: "asc", sortIndex: 0 },
      ],
      defaultState: { sort: null },
    });
  }

  clearSort() {
    this.gridApi.applyColumnState({
      defaultState: { sort: null },
    });
  }

  saveSort() {
    const colState = this.gridApi.getColumnState();
    const sortState = colState
      .filter(function (s) {
        return s.sort != null;
      })
      .map(function (s) {
        return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
      });
    savedSort = sortState;
    console.log("saved sort", sortState);
  }

  restoreFromSave() {
    this.gridApi.applyColumnState({
      state: savedSort,
      defaultState: { sort: null },
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

let savedSort: any;
