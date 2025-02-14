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
  ModuleRegistry,
  QuickFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <input
        type="text"
        id="filter-text-box"
        placeholder="Filter..."
        (input)="onFilterTextBoxChanged()"
      />
      <button
        id="applyBeforePivotOrAgg"
        style="margin-left: 20px"
        (click)="onApplyBeforePivotOrAgg()"
      >
        Apply Before Pivot/Aggregation
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [pivotMode]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "sport" },
    { field: "year", pivot: true },
    { field: "age" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 250,
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onApplyBeforePivotOrAgg() {
    applyBeforePivotOrAgg = !applyBeforePivotOrAgg;
    this.gridApi.setGridOption(
      "applyQuickFilterBeforePivotOrAgg",
      applyBeforePivotOrAgg,
    );
    document.querySelector("#applyBeforePivotOrAgg")!.textContent =
      `Apply ${applyBeforePivotOrAgg ? "After" : "Before"} Pivot/Aggregation`;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

let applyBeforePivotOrAgg = false;
