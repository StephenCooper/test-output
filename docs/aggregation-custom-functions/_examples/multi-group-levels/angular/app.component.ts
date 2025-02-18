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
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
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
    [aggFuncs]="aggFuncs"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "total", aggFunc: "simpleRange" },
    { field: "total", aggFunc: "range" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 220,
  };
  aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    simpleRange: (params) => {
      const values = params.values;
      const max = Math.max(...values);
      const min = Math.min(...values);
      return max - min;
    },
    range: (params) => {
      const values = params.values;
      if (params.rowNode.leafGroup) {
        const max = Math.max(...values);
        const min = Math.min(...values);
        return {
          max: max,
          min: min,
          value: max - min,
        };
      }
      let max = values[0].max;
      let min = values[0].min;
      values.forEach((value) => {
        max = Math.max(max, value.max);
        min = Math.min(min, value.min);
      });
      return {
        max: max,
        min: min,
        value: max - min,
      };
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
