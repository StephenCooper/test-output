import { Component } from "@angular/core";
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
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="height: 100%; box-sizing: border-box">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { headerName: "Name (field)", field: "name" },
    // Using dot notation to access nested property
    { headerName: "Country (field & dot notation)", field: "person.country" },
    // Show default header name
    {
      headerName: "Total Medals (valueGetter)",
      valueGetter: (p) =>
        p.data.medals.gold + p.data.medals.silver + p.data.medals.bronze,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  rowData: any[] | null = getData();
}
