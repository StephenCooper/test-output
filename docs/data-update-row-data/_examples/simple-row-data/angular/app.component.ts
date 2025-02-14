import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface ICar {
  make: string;
  model: string;
  price: number;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div
    style="height: 100%; width: 100%; display: flex; flex-direction: column"
  >
    <div style="margin-bottom: 5px; min-height: 30px">
      <button (click)="onRowDataA()">Row Data A</button>
      <button (click)="onRowDataB()">Row Data B</button>
      <button (click)="onClearRowData()">Clear Row Data</button>
    </div>
    <div style="flex: 1 1 0px">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [rowData]="rowData"
        [rowSelection]="rowSelection"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<ICar>;

  columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ];
  rowData: ICar[] | null = rowDataA;
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true,
  };

  onRowDataA() {
    this.gridApi.setGridOption("rowData", rowDataA);
  }

  onRowDataB() {
    this.gridApi.setGridOption("rowData", rowDataB);
  }

  onClearRowData() {
    // Clear rowData by setting it to an empty array
    this.gridApi.setGridOption("rowData", []);
  }

  onGridReady(params: GridReadyEvent<ICar>) {
    this.gridApi = params.api;
  }
}

// specify the data
const rowDataA: ICar[] = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];
const rowDataB: ICar[] = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "BMW", model: "M50", price: 60000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];
