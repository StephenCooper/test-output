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
  ValidationModule,
  createGrid,
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
  template: `<div class="example-wrapper">
    <div class="legend-bar">
      <span class="legend-box resizable-header"></span> Resizable Column
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span class="legend-box fixed-size-header"></span> Fixed Width Column
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Everything Resizes",
      children: [
        {
          field: "athlete",
          headerClass: "resizable-header",
        },
        { field: "age", headerClass: "resizable-header" },
        {
          field: "country",
          headerClass: "resizable-header",
        },
      ],
    },
    {
      headerName: "Only Year Resizes",
      children: [
        { field: "year", headerClass: "resizable-header" },
        {
          field: "date",
          resizable: false,
          headerClass: "fixed-size-header",
        },
        {
          field: "sport",
          resizable: false,
          headerClass: "fixed-size-header",
        },
      ],
    },
    {
      headerName: "Nothing Resizes",
      children: [
        {
          field: "gold",
          resizable: false,
          headerClass: "fixed-size-header",
        },
        {
          field: "silver",
          resizable: false,
          headerClass: "fixed-size-header",
        },
        {
          field: "bronze",
          resizable: false,
          headerClass: "fixed-size-header",
        },
        {
          field: "total",
          resizable: false,
          headerClass: "fixed-size-header",
        },
      ],
    },
  ];
  defaultColDef: ColDef = {
    width: 150,
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
