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
  HeaderClassParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

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
      headerStyle: { color: "white", backgroundColor: "cadetblue" },
      children: [
        {
          field: "athlete",
          headerStyle: { color: "white", backgroundColor: "teal" },
        },
        { field: "age", initialWidth: 120 },
        {
          field: "country",
          headerStyle: (params: HeaderClassParams) => {
            return {
              color: "white",
              backgroundColor: params.floatingFilter
                ? "cornflowerblue"
                : "teal",
            };
          },
        },
      ],
    },
    {
      field: "sport",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerName: "The Sport the athlete participated in",
      headerClass: "sport-header",
    },
    {
      headerName: "Medal Details",
      headerStyle: (params) => {
        return {
          color: "white",
          backgroundColor: params.columnGroup?.isExpanded()
            ? "cornflowerblue"
            : "orangered",
        };
      },
      children: [
        { field: "bronze", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "gold", columnGroupShow: "open" },
        {
          columnGroupShow: "closed",
          field: "total",
        },
      ],
    },
  ];
  defaultColDef: ColDef = {
    initialWidth: 200,
    floatingFilter: true,
    filter: true,
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
