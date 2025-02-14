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
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Athlete Details",
      suppressStickyLabel: true,
      children: [
        { field: "athlete", pinned: true, colId: "athlete" },
        { field: "country", colId: "country" },
        { field: "age", colId: "age" },
      ],
    },
    {
      headerName: "Sports Results",
      suppressStickyLabel: true,
      openByDefault: true,
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold", columnGroupShow: "open" },
        { field: "silver", colId: "silver", columnGroupShow: "open" },
        { field: "bronze", colId: "bronze", columnGroupShow: "open" },
        { field: "total", colId: "total", columnGroupShow: "closed" },
      ],
    },
  ];
  defaultColDef: ColDef = {
    width: 200,
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
