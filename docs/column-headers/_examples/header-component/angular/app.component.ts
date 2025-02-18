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
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
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
    { field: "athlete", suppressHeaderFilterButton: true, minWidth: 120 },
    {
      field: "age",
      sortable: false,
      headerComponentParams: { menuIcon: "fa-external-link-alt" },
    },
    { field: "country", suppressHeaderFilterButton: true, minWidth: 120 },
    { field: "year", sortable: false },
    { field: "date", suppressHeaderFilterButton: true },
    { field: "sport", sortable: false },
    {
      field: "gold",
      headerComponentParams: { menuIcon: "fa-cog" },
      minWidth: 120,
    },
    { field: "silver", sortable: false },
    { field: "bronze", suppressHeaderFilterButton: true, minWidth: 120 },
    { field: "total", sortable: false },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
    headerComponent: CustomHeader,
    headerComponentParams: {
      menuIcon: "fa-filter",
    },
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
