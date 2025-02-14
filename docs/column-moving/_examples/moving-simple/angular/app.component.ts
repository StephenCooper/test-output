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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <button (click)="onMedalsFirst()">Medals First</button>
      <button (click)="onMedalsLast()">Medals Last</button>
      <button (click)="onCountryFirst()">Country First</button>
      <button (click)="onSwapFirstTwo()">Swap First Two</button>
      <button (click)="onPrintColumns()">Print Columns</button>
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
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
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

  onMedalsFirst() {
    this.gridApi.moveColumns(["gold", "silver", "bronze", "total"], 0);
  }

  onMedalsLast() {
    this.gridApi.moveColumns(["gold", "silver", "bronze", "total"], 6);
  }

  onCountryFirst() {
    this.gridApi.moveColumns(["country"], 0);
  }

  onSwapFirstTwo() {
    this.gridApi.moveColumnByIndex(0, 1);
  }

  onPrintColumns() {
    const cols = this.gridApi.getAllGridColumns();
    const colToNameFunc = (col: Column, index: number) =>
      index + " = " + col.getId();
    const colNames = cols.map(colToNameFunc).join(", ");
    console.log("columns are: " + colNames);
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
