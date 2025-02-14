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
  INumberFilterParams,
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
import { SliderFloatingFilter } from "./slider-floating-filter.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, SliderFloatingFilter],
  template: `<div style="height: 100%; box-sizing: border-box">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [alwaysShowVerticalScroll]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", filter: false },
    {
      field: "gold",
      filter: "agNumberColumnFilter",
      filterParams: filterParams,
      floatingFilterComponent: SliderFloatingFilter,
      floatingFilterComponentParams: {
        maxValue: 7,
      },
      suppressFloatingFilterButton: true,
      suppressHeaderMenuButton: false,
    },
    {
      field: "silver",
      filter: "agNumberColumnFilter",
      filterParams: filterParams,
      floatingFilterComponent: SliderFloatingFilter,
      floatingFilterComponentParams: {
        maxValue: 5,
      },
      suppressFloatingFilterButton: true,
      suppressHeaderMenuButton: false,
    },
    {
      field: "bronze",
      filter: "agNumberColumnFilter",
      filterParams: filterParams,
      floatingFilterComponent: SliderFloatingFilter,
      floatingFilterComponentParams: {
        maxValue: 10,
      },
      suppressFloatingFilterButton: true,
      suppressHeaderMenuButton: false,
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

const filterParams: INumberFilterParams = {
  filterOptions: ["greaterThan"],
  maxNumConditions: 1,
};
