import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomFilterModule,
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
  NumberFilterModule,
  ClientSideRowModelModule,
  TextFilterModule,
  CustomFilterModule,
  ValidationModule /* Development Only */,
]);
import { NumberFilterComponent } from "./number-filter-component.component";
import { NumberFloatingFilterComponent } from "./number-floating-filter-component.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [
    AgGridAngular,
    NumberFilterComponent,
    NumberFloatingFilterComponent,
  ],
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", filter: "agTextColumnFilter" },
    {
      field: "gold",
      floatingFilterComponent: NumberFloatingFilterComponent,
      filter: NumberFilterComponent,
      suppressFloatingFilterButton: true,
    },
    {
      field: "silver",
      floatingFilterComponent: NumberFloatingFilterComponent,
      filter: NumberFilterComponent,
      suppressFloatingFilterButton: true,
    },
    {
      field: "bronze",
      floatingFilterComponent: NumberFloatingFilterComponent,
      filter: NumberFilterComponent,
      suppressFloatingFilterButton: true,
    },
    {
      field: "total",
      floatingFilterComponent: NumberFloatingFilterComponent,
      filter: NumberFilterComponent,
      suppressFloatingFilterButton: true,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
