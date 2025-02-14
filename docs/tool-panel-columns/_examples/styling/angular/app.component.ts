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
  HeaderValueGetterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  PivotModule,
  RowGroupingPanelModule,
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
    [autoGroupColumnDef]="autoGroupColumnDef"
    [sideBar]="sideBar"
    [rowGroupPanelShow]="rowGroupPanelShow"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "age",
      enableValue: true,
    },
    {
      field: "country",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
      headerValueGetter: countryHeaderValueGetter,
    },
    {
      field: "year",
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "date",
      minWidth: 180,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "sport",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "gold",
      hide: true,
      enableValue: true,
      toolPanelClass: "tp-gold",
    },
    {
      field: "silver",
      hide: true,
      enableValue: true,
      toolPanelClass: ["tp-silver"],
    },
    {
      field: "bronze",
      hide: true,
      enableValue: true,
      toolPanelClass: (params) => {
        return "tp-bronze";
      },
    },
    {
      headerName: "Total",
      field: "total",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "columns";
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
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

function countryHeaderValueGetter(params: HeaderValueGetterParams) {
  switch (params.location) {
    case "csv":
      return "CSV Country";
    case "columnToolPanel":
      return "TP Country";
    case "columnDrop":
      return "CD Country";
    case "header":
      return "H Country";
    default:
      return "Should never happen!";
  }
}
