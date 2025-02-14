import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
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
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { NumberFloatingFilterComponent } from "./number-floating-filter-component.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, NumberFloatingFilterComponent],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", filter: false },
    {
      field: "gold",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "gold",
      },
      suppressFloatingFilterButton: true,
    },
    {
      field: "silver",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "silver",
      },
      suppressFloatingFilterButton: true,
    },
    {
      field: "bronze",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "#CD7F32",
      },
      suppressFloatingFilterButton: true,
    },
    {
      field: "total",
      filter: "agNumberColumnFilter",
      suppressHeaderFilterButton: true,
      floatingFilterComponent: NumberFloatingFilterComponent,
      floatingFilterComponentParams: {
        color: "unset",
      },
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
