import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
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
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <button (click)="getAllRows()">Log All Rows</button>
      <button (click)="getRowById()">Get ONE Row</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

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

  getAllRows() {
    this.gridApi.forEachNode((rowNode) => {
      console.log(`=============== ROW ${rowNode.rowIndex}`);
      console.log(`id = ${rowNode.id}`);
      console.log(`rowIndex = ${rowNode.rowIndex}`);
      console.log(`data = ${JSON.stringify(rowNode.data)}`);
      console.log(`group = ${rowNode.group}`);
      console.log(`height = ${rowNode.rowHeight}px`);
      console.log(`isSelected = ${rowNode.isSelected()}`);
    });
    window.alert("Row details printed to developers console");
  }

  getRowById() {
    const rowNode = this.gridApi.getRowNode("c2");
    if (rowNode && rowNode.id == "c2") {
      console.log(`################ Got Row Node C2`);
      console.log(`data = ${JSON.stringify(rowNode.data)}`);
    }
    window.alert("Row details printed to developers console");
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
