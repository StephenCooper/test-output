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
  IAggFunc,
  ModuleRegistry,
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { ColumnMenuModule, RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  RowGroupingModule,
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
    [grandTotalRow]="grandTotalRow"
    [groupTotalRow]="groupTotalRow"
    [aggFuncs]="aggFuncs"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "bronze", aggFunc: "sum" },
    { field: "silver", aggFunc: "2x+1" },
    { field: "gold", aggFunc: "avg" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  grandTotalRow: "top" | "bottom" = "bottom";
  groupTotalRow: "top" | "bottom" | UseGroupTotalRow = "bottom";
  aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    "2x+1": (params) => {
      const value = params.values[0];
      return 2 * value + 1;
    },
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
