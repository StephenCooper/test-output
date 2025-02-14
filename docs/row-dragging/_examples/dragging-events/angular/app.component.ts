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
  NumberFilterModule,
  RowDragCancelEvent,
  RowDragEndEvent,
  RowDragEnterEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header" style="background-color: #ccaa22a9">
      Rows in this example do not move, only events are fired
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (rowDragEnter)="onRowDragEnter($event)"
      (rowDragEnd)="onRowDragEnd($event)"
      (rowDragMove)="onRowDragMove($event)"
      (rowDragLeave)="onRowDragLeave($event)"
      (rowDragCancel)="onRowDragCancel($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", rowDrag: true },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    width: 170,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onRowDragEnter(e: RowDragEnterEvent) {
    console.log("onRowDragEnter", e);
  }

  onRowDragEnd(e: RowDragEndEvent) {
    console.log("onRowDragEnd", e);
  }

  onRowDragMove(e: RowDragMoveEvent) {
    console.log("onRowDragMove", e);
  }

  onRowDragLeave(e: RowDragLeaveEvent) {
    console.log("onRowDragLeave", e);
  }

  onRowDragCancel(e: RowDragCancelEvent) {
    console.log("onRowDragCancel", e);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
