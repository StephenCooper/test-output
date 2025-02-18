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
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
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
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      minWidth: 200,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      field: "age",
      filter: true,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
    },
    {
      field: "country",
      minWidth: 200,
      filter: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "year",
      filter: true,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    { field: "sport", minWidth: 200, suppressHeaderContextMenu: true },
    {
      field: "gold",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "silver",
      filter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "bronze",
      filter: true,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "total",
      filter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      suppressHeaderContextMenu: true,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
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
