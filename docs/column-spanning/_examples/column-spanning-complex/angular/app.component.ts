import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellClassRules,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColSpanParams,
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowHeightParams,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [getRowHeight]="getRowHeight"
    [rowData]="rowData"
    [defaultColDef]="defaultColDef"
    [autoSizeStrategy]="autoSizeStrategy"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Jan",
      field: "jan",
      colSpan: (params: ColSpanParams) => {
        if (isHeaderRow(params)) {
          return 6;
        } else if (isQuarterRow(params)) {
          return 3;
        } else {
          return 1;
        }
      },
      cellClassRules: cellClassRules,
    },
    { headerName: "Feb", field: "feb" },
    { headerName: "Mar", field: "mar" },
    {
      headerName: "Apr",
      field: "apr",
      colSpan: (params: ColSpanParams) => {
        if (isQuarterRow(params)) {
          return 3;
        } else {
          return 1;
        }
      },
      cellClassRules: cellClassRules,
    },
    { headerName: "May", field: "may" },
    { headerName: "Jun", field: "jun" },
  ];
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    if (isHeaderRow(params)) {
      return 60;
    }
  };
  rowData: any[] | null = getData();
  defaultColDef: ColDef = {
    width: 100,
    sortable: false,
    suppressMovable: true,
  };
  autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: "fitGridWidth",
  };
}

const cellClassRules: CellClassRules = {
  "header-cell": 'data.section === "big-title"',
  "quarters-cell": 'data.section === "quarters"',
};
function isHeaderRow(params: RowHeightParams | ColSpanParams) {
  return params.data.section === "big-title";
}
function isQuarterRow(params: ColSpanParams) {
  return params.data.section === "quarters";
}
