import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
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
import { CustomInnerHeaderGroup } from "./custom-inner-header-group.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomInnerHeaderGroup],
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
      headerGroupComponentParams: {
        innerHeaderGroupComponent: CustomInnerHeaderGroup,
        icon: "fa-user",
      },
      children: [
        { field: "athlete", width: 150 },
        { field: "age", width: 90, columnGroupShow: "open" },
        {
          field: "country",
          width: 120,
          columnGroupShow: "open",
        },
      ],
    },
    {
      headerName: "Medal details",
      headerGroupComponentParams: {
        innerHeaderGroupComponent: CustomInnerHeaderGroup,
      },
      children: [
        { field: "year", width: 90 },
        { field: "date", width: 110 },
        {
          field: "sport",
          width: 110,
          columnGroupShow: "open",
        },
        {
          field: "gold",
          width: 100,
          columnGroupShow: "open",
        },
        {
          field: "silver",
          width: 100,
          columnGroupShow: "open",
        },
        {
          field: "bronze",
          width: 100,
          columnGroupShow: "open",
        },
        {
          field: "total",
          width: 100,
          columnGroupShow: "open",
        },
      ],
    },
  ];
  defaultColDef: ColDef = {
    width: 100,
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
