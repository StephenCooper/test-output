import { Component } from "@angular/core";
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
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
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
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "ID #",
      maxWidth: 100,
      valueGetter: hashValueGetter,
    },
    { field: "a" },
    { field: "b" },
    {
      headerName: "A + B",
      colId: "a&b",
      valueGetter: abValueGetter,
    },
    {
      headerName: "A * 1000",
      minWidth: 95,
      valueGetter: a1000ValueGetter,
    },
    {
      headerName: "B * 137",
      minWidth: 90,
      valueGetter: b137ValueGetter,
    },
    {
      headerName: "Random",
      minWidth: 90,
      valueGetter: randomValueGetter,
    },
    {
      headerName: "Chain",
      valueGetter: chainValueGetter,
    },
    {
      headerName: "Const",
      minWidth: 85,
      valueGetter: constValueGetter,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 75,
    // cellClass: 'number-cell'
  };
  rowData: any[] | null = createRowData();
}

function hashValueGetter(params: ValueGetterParams) {
  return params.node ? Number(params.node.id) : null;
}
function abValueGetter(params: ValueGetterParams) {
  return params.data.a + params.data.b;
}
function a1000ValueGetter(params: ValueGetterParams) {
  return params.data.a * 1000;
}
function b137ValueGetter(params: ValueGetterParams) {
  return params.data.b * 137;
}
function randomValueGetter() {
  return Math.floor(Math.random() * 1000);
}
function chainValueGetter(params: ValueGetterParams) {
  return params.getValue("a&b") * 1000;
}
function constValueGetter() {
  return 99999;
}
function createRowData() {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(i % 4),
      b: Math.floor(i % 7),
    });
  }
  return rowData;
}
