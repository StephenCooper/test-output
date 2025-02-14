import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowModelType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  RowSelectionModule,
  InfiniteRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowModelType]="rowModelType"
    [rowSelection]="rowSelection"
    [maxBlocksInCache]="maxBlocksInCache"
    [getRowId]="getRowId"
    [datasource]="datasource"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = getColumnDefs();
  rowModelType: RowModelType = "infinite";
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    headerCheckbox: false,
  };
  maxBlocksInCache = 2;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.a;
  };
  datasource: IDatasource = getDataSource(100);
  defaultColDef: ColDef = {
    sortable: false,
  };
  rowData!: any[];
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
function getColumnDefs() {
  const columnDefs: ColDef[] = [
    { headerName: "#", width: 80, valueGetter: "node.rowIndex" },
  ];
  ALPHABET.forEach((letter) => {
    columnDefs.push({
      headerName: letter.toUpperCase(),
      field: letter,
      width: 150,
    });
  });
  return columnDefs;
}
function getDataSource(count: number) {
  const dataSource: IDatasource = {
    rowCount: count,
    getRows: (params: IGetRowsParams) => {
      const rowsThisPage: any[] = [];
      for (
        var rowIndex = params.startRow;
        rowIndex < params.endRow;
        rowIndex++
      ) {
        var record: Record<string, string> = {};
        ALPHABET.forEach(function (letter, colIndex) {
          const randomNumber = 17 + rowIndex + colIndex;
          const cellKey = letter.toUpperCase() + (rowIndex + 1);
          record[letter] = cellKey + " = " + randomNumber;
        });
        rowsThisPage.push(record);
      }
      // to mimic server call, we reply after a short delay
      setTimeout(() => {
        // no need to pass the second 'rowCount' parameter as we have already provided it
        params.successCallback(rowsThisPage);
      }, 100);
    },
  };
  return dataSource;
}
