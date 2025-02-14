import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
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
          <button (click)="onBtPivotOn()">Pivot On</button>
          <br />
          <button (click)="onBtPivotOff()">Pivot Off</button>
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
          <button (click)="onBtPinnedOn()">Pinned On</button>
          <br />
          <button (click)="onBtPinnedOff()">Pinned Off</button>
        </div>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [defaultColDef]="defaultColDef"
      [columnDefs]="columnDefs"
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

  defaultColDef: ColDef = {
    width: 150,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  };
  columnDefs: ColDef[] = getColumnDefs();
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
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "age") {
        colDef.sort = "desc";
      }
      if (colDef.field === "athlete") {
        colDef.sort = "asc";
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtSortOff() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.sort = null;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtWidthNarrow() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "age" || colDef.field === "athlete") {
        colDef.width = 100;
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtWidthNormal() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.width = 200;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtHide() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "age" || colDef.field === "athlete") {
        colDef.hide = true;
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtShow() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.hide = false;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtPivotOn() {
    this.gridApi.setGridOption("pivotMode", true);
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "country") {
        colDef.pivot = true;
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtPivotOff() {
    this.gridApi.setGridOption("pivotMode", false);
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.pivot = false;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtRowGroupOn() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "sport") {
        colDef.rowGroup = true;
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtRowGroupOff() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.rowGroup = false;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtAggFuncOn() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (
        colDef.field === "gold" ||
        colDef.field === "silver" ||
        colDef.field === "bronze"
      ) {
        colDef.aggFunc = "sum";
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtAggFuncOff() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.aggFunc = null;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtPinnedOn() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "athlete") {
        colDef.pinned = "left";
      }
      if (colDef.field === "age") {
        colDef.pinned = "right";
      }
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtPinnedOff() {
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.pinned = null;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
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

function getColumnDefs(): ColDef[] {
  return [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
}
