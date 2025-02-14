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
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CustomHeader } from "./custom-header.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomHeader],
  template: `<div class="test-container">
    <div class="test-header">
      <button (click)="onBtUpperNames()">Upper Header Names</button>
      <button (click)="onBtLowerNames()">Lower Header Names</button>
      &nbsp;&nbsp;&nbsp;
      <button (click)="onBtFilterOn()">Filter On</button>
      <button (click)="onBtFilterOff()">Filter Off</button>
      &nbsp;&nbsp;&nbsp;
      <button (click)="onBtResizeOn()">Resize On</button>
      <button (click)="onBtResizeOff()">Resize Off</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
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
    headerComponent: CustomHeader,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtUpperNames() {
    const columnDefs: ColDef[] = [
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
    columnDefs.forEach((c) => {
      c.headerName = c.field!.toUpperCase();
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtLowerNames() {
    const columnDefs: ColDef[] = [
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
    columnDefs.forEach((c) => {
      c.headerName = c.field;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtFilterOn() {
    const columnDefs: ColDef[] = [
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
    columnDefs.forEach((c) => {
      c.filter = true;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtFilterOff() {
    const columnDefs: ColDef[] = [
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
    columnDefs.forEach((c) => {
      c.filter = false;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtResizeOn() {
    const columnDefs: ColDef[] = [
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
    columnDefs.forEach((c) => {
      c.resizable = true;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onBtResizeOff() {
    const columnDefs: ColDef[] = [
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
    columnDefs.forEach((c) => {
      c.resizable = false;
    });
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
