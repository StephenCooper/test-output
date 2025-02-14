import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
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

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [defaultColDef]="defaultColDef"
    [getRowId]="getRowId"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "id", headerName: "Row ID" },
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ];
  rowData: any[] | null = [
    { id: "c1", make: "Toyota", model: "Celica", price: 35000 },
    { id: "c2", make: "Ford", model: "Mondeo", price: 32000 },
    { id: "c8", make: "Porsche", model: "Boxster", price: 72000 },
    { id: "c4", make: "BMW", model: "M50", price: 60000 },
    { id: "c14", make: "Aston Martin", model: "DBX", price: 190000 },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => String(params.data.id);
}
