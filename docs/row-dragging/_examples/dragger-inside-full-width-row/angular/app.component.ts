import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IsFullWidthRowParams,
  ModuleRegistry,
  RowDragModule,
  RowHeightParams,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { FullWidthCellRenderer } from "./full-width-cell-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, FullWidthCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [rowDragManaged]="true"
    [getRowHeight]="getRowHeight"
    [isFullWidthRow]="isFullWidthRow"
    [fullWidthCellRenderer]="fullWidthCellRenderer"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "name", cellRenderer: countryCellRenderer },
    { field: "continent" },
    { field: "language" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };
  rowData: any[] | null = getData();
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    // return 100px height for full width rows
    if (isFullWidth(params.data)) {
      return 100;
    }
  };
  isFullWidthRow: (params: IsFullWidthRowParams) => boolean = (
    params: IsFullWidthRowParams,
  ) => {
    return isFullWidth(params.rowNode.data);
  };
  fullWidthCellRenderer: any = FullWidthCellRenderer;
}

function countryCellRenderer(params: ICellRendererParams) {
  if (!params.fullWidth) {
    return params.value;
  }
  const flag =
    '<img border="0" width="15" height="10" src="https://www.ag-grid.com/example-assets/flags/' +
    params.data.code +
    '.png">';
  return (
    '<span style="cursor: default;">' + flag + " " + params.value + "</span>"
  );
}
function isFullWidth(data: any) {
  // return true when country is Peru, France or Italy
  return ["Peru", "France", "Italy"].indexOf(data.name) >= 0;
}
