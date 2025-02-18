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
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CustomFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { NumberFilterComponent } from "./number-filter-component.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, NumberFilterComponent],
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
    { field: "athlete", width: 150, filter: false },
    {
      field: "gold",
      width: 100,
      filter: NumberFilterComponent,
      suppressHeaderMenuButton: true,
    },
    {
      field: "silver",
      width: 100,
      filter: NumberFilterComponent,
      suppressHeaderMenuButton: true,
    },
    {
      field: "bronze",
      width: 100,
      filter: NumberFilterComponent,
      suppressHeaderMenuButton: true,
    },
    {
      field: "total",
      width: 100,
      filter: NumberFilterComponent,
      suppressHeaderMenuButton: true,
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
