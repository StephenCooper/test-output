import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  Column,
  ColumnApiModule,
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnPivotChangedEvent,
  ColumnResizedEvent,
  ColumnRowGroupChangedEvent,
  ColumnValueChangedEvent,
  ColumnVisibleEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SortChangedEvent,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <div class="test-button-row">
        <div class="test-button-group">
          <button (click)="onBtSortOn()">Sort On</button>
          <br />
          <button (click)="onBtSortOff()">Sort Off</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtWidthNarrow()">Width Narrow</button>
          <br />
          <button (click)="onBtWidthNormal()">Width Normal</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtHide()">Hide Cols</button>
          <br />
          <button (click)="onBtShow()">Show Cols</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtReverseOrder()">Reverse Medal Order</button>
          <br />
          <button (click)="onBtNormalOrder()">Normal Medal Order</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtRowGroupOn()">Row Group On</button>
          <br />
          <button (click)="onBtRowGroupOff()">Row Group Off</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtAggFuncOn()">Agg Func On</button>
          <br />
          <button (click)="onBtAggFuncOff()">Agg Func Off</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtPivotOn()">Pivot On</button>
          <br />
          <button (click)="onBtPivotOff()">Pivot Off</button>
        </div>
        <div class="test-button-group">
          <button (click)="onBtPinnedOn()">Pinned On</button>
          <br />
          <button (click)="onBtPinnedOff()">Pinned Off</button>
        </div>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (sortChanged)="onSortChanged($event)"
      (columnResized)="onColumnResized($event)"
      (columnVisible)="onColumnVisible($event)"
      (columnPivotChanged)="onColumnPivotChanged($event)"
      (columnRowGroupChanged)="onColumnRowGroupChanged($event)"
      (columnValueChanged)="onColumnValueChanged($event)"
      (columnMoved)="onColumnMoved($event)"
      (columnPinned)="onColumnPinned($event)"
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
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    width: 150,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onSortChanged(e: SortChangedEvent) {
    console.log("Event Sort Changed", e);
  }

  onColumnResized(e: ColumnResizedEvent) {
    console.log("Event Column Resized", e);
  }

  onColumnVisible(e: ColumnVisibleEvent) {
    console.log("Event Column Visible", e);
  }

  onColumnPivotChanged(e: ColumnPivotChangedEvent) {
    console.log("Event Pivot Changed", e);
  }

  onColumnRowGroupChanged(e: ColumnRowGroupChangedEvent) {
    console.log("Event Row Group Changed", e);
  }

  onColumnValueChanged(e: ColumnValueChangedEvent) {
    console.log("Event Value Changed", e);
  }

  onColumnMoved(e: ColumnMovedEvent) {
    console.log("Event Column Moved", e);
  }

  onColumnPinned(e: ColumnPinnedEvent) {
    console.log("Event Column Pinned", e);
  }

  onBtSortOn() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "age", sort: "desc" },
        { colId: "athlete", sort: "asc" },
      ],
    });
  }

  onBtSortOff() {
    this.gridApi.applyColumnState({
      defaultState: { sort: null },
    });
  }

  onBtWidthNarrow() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "age", width: 100 },
        { colId: "athlete", width: 100 },
      ],
    });
  }

  onBtWidthNormal() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "age", width: 200 },
        { colId: "athlete", width: 200 },
      ],
    });
  }

  onBtHide() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "age", hide: true },
        { colId: "athlete", hide: true },
      ],
    });
  }

  onBtShow() {
    this.gridApi.applyColumnState({
      defaultState: { hide: false },
    });
  }

  onBtPivotOn() {
    this.gridApi.setGridOption("pivotMode", true);
    this.gridApi.applyColumnState({
      state: [{ colId: "country", pivot: true }],
    });
  }

  onBtPivotOff() {
    this.gridApi.setGridOption("pivotMode", false);
    this.gridApi.applyColumnState({
      defaultState: { pivot: false },
    });
  }

  onBtRowGroupOn() {
    this.gridApi.applyColumnState({
      state: [{ colId: "sport", rowGroup: true }],
    });
  }

  onBtRowGroupOff() {
    this.gridApi.applyColumnState({
      defaultState: { rowGroup: false },
    });
  }

  onBtAggFuncOn() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "gold", aggFunc: "sum" },
        { colId: "silver", aggFunc: "sum" },
        { colId: "bronze", aggFunc: "sum" },
      ],
    });
  }

  onBtAggFuncOff() {
    this.gridApi.applyColumnState({
      defaultState: { aggFunc: null },
    });
  }

  onBtNormalOrder() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
      ],
      applyOrder: true,
    });
  }

  onBtReverseOrder() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "bronze" },
        { colId: "silver" },
        { colId: "gold" },
      ],
      applyOrder: true,
    });
  }

  onBtPinnedOn() {
    this.gridApi.applyColumnState({
      state: [
        { colId: "athlete", pinned: "left" },
        { colId: "age", pinned: "right" },
      ],
    });
  }

  onBtPinnedOff() {
    this.gridApi.applyColumnState({
      defaultState: { pinned: null },
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
