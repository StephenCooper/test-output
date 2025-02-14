import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="wrapper">
    <div class="legend-bar">
      <span class="legend-box locked-col"></span> Position Locked Column
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span class="legend-box suppress-movable-col"></span> Suppress Movable
      Column
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [suppressDragLeaveHidesColumns]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      suppressMovable: true,
      cellClass: "suppress-movable-col",
    },
    { field: "age", lockPosition: "left", cellClass: "locked-col" },
    { field: "country" },
    { field: "year" },
    { field: "total", lockPosition: "right", cellClass: "locked-col" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    lockPinned: true, // Dont allow pinning for this example
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
