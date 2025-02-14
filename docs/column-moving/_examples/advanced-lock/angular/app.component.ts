import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  ColumnPinnedEvent,
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
  ColumnApiModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { ControlsCellRenderer } from "./controls-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, ControlsCellRenderer],
  template: `<div class="example-wrapper">
    <div class="legend-bar">
      <button (click)="onPinAthleteLeft()">Pin Athlete Left</button>
      <button (click)="onPinAthleteRight()">Pin Athlete Right</button>
      <button (click)="onUnpinAthlete()">Un-Pin Athlete</button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span class="locked-col legend-box"></span> Position Locked Column
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [suppressDragLeaveHidesColumns]="true"
      [rowData]="rowData"
      (columnPinned)="onColumnPinned($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      lockPosition: "left",
      cellRenderer: ControlsCellRenderer,
      cellClass: "locked-col",
      width: 120,
      suppressNavigable: true,
    },
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    width: 150,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onColumnPinned(event: ColumnPinnedEvent) {
    const allCols = event.api.getAllGridColumns();
    if (event.pinned !== "right") {
      const allFixedCols = allCols.filter(
        (col) => col.getColDef().lockPosition,
      );
      event.api.setColumnsPinned(allFixedCols, event.pinned);
    }
  }

  onPinAthleteLeft() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", pinned: "left" }],
    });
  }

  onPinAthleteRight() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", pinned: "right" }],
    });
  }

  onUnpinAthlete() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", pinned: null }],
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
