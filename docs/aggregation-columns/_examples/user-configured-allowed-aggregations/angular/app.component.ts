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
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ColumnsToolPanelModule,
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
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    {
      headerName: "First or Last",
      field: "total",
      aggFunc: "first",
      allowedAggFuncs: ["first", "last"],
      enableValue: true,
    },
    {
      headerName: "Min or Max",
      field: "total",
      aggFunc: "min",
      allowedAggFuncs: ["min", "max"],
      enableValue: true,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "columns";
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
