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
  ScrollApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ScrollApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <div style="padding: 4px">
        <button (click)="clearPinned()">Clear Pinned</button>
        <button (click)="resetPinned()">
          Left = #, Athlete, Age; Right = Total
        </button>
        <button (click)="pinCountry()">Left = Country</button>
      </div>

      <div style="padding: 4px">
        Jump to:
        <input
          placeholder="row"
          type="text"
          style="width: 40px"
          id="row"
          (input)="jumpToRow()"
        />
        <input
          placeholder="col"
          type="text"
          style="width: 40px"
          id="col"
          (input)="jumpToCol()"
        />
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
    {
      headerName: "#",
      colId: "rowNum",
      valueGetter: "node.id",
      width: 80,
      pinned: "left",
    },
    { field: "athlete", width: 150, pinned: "left" },
    { field: "age", width: 90, pinned: "left" },
    { field: "country", width: 150 },
    { field: "year", width: 90 },
    { field: "date", width: 110 },
    { field: "sport", width: 150 },
    { field: "gold", width: 100 },
    { field: "silver", width: 100 },
    { field: "bronze", width: 100 },
    { field: "total", width: 100, pinned: "right" },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  clearPinned() {
    this.gridApi.applyColumnState({ defaultState: { pinned: null } });
  }

  resetPinned() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "rowNum", pinned: "left" },
        { colId: "athlete", pinned: "left" },
        { colId: "age", pinned: "left" },
        { colId: "total", pinned: "right" },
      ],
      defaultState: { pinned: null },
    });
  }

  pinCountry() {
    this.gridApi.applyColumnState({
      state: [{ colId: "country", pinned: "left" }],
      defaultState: { pinned: null },
    });
  }

  jumpToCol() {
    const value = (document.getElementById("col") as HTMLInputElement).value;
    if (typeof value !== "string" || value === "") {
      return;
    }
    const index = Number(value);
    if (typeof index !== "number" || isNaN(index)) {
      return;
    }
    // it's actually a column the api needs, so look the column up
    const allColumns = this.gridApi.getColumns();
    if (allColumns) {
      const column = allColumns[index];
      if (column) {
        this.gridApi.ensureColumnVisible(column);
      }
    }
  }

  jumpToRow() {
    const value = (document.getElementById("row") as HTMLInputElement).value;
    const index = Number(value);
    if (typeof index === "number" && !isNaN(index)) {
      this.gridApi.ensureIndexVisible(index);
    }
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
