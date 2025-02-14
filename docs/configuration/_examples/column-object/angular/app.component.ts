import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <button (click)="getAllColumns()">Log All Columns</button>
      <button (click)="getAllColumnIds()">Log All Column IDs</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ];
  rowData: any[] | null = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
    { make: "BMW", model: "M50", price: 60000 },
    { make: "Aston Martin", model: "DBX", price: 190000 },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };

  getAllColumns() {
    console.log(this.gridApi.getColumns());
    window.alert("Columns printed to developer's console");
  }

  getAllColumnIds() {
    const columns = this.gridApi.getColumns();
    if (columns) {
      console.log(columns.map((col) => col.getColId()));
    }
    window.alert("Column IDs printed to developer's console");
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
