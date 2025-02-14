import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
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
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <div>
        <button (click)="addDefault()">Default Transaction</button>
        <button (click)="addDelta()">Delta Transaction</button>
        Transaction took: <span id="transactionDuration">N/A</span>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [deltaSort]="true"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "id" },
    { field: "updatedBy" },
    { field: "sort", sortIndex: 0, sort: "desc" },
    { field: "sort1", sortIndex: 1, sort: "desc" },
    { field: "sort2", sortIndex: 2, sort: "desc" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  rowData: any[] | null = getRowData(100000);
  getRowId: GetRowIdFunc = ({ data }: GetRowIdParams) => String(data.id);

  addDelta() {
    const transaction = {
      add: getRowData(1).map((row) => ({ ...row, updatedBy: "delta" })),
      update: [{ id: 1, make: "Delta", updatedBy: "delta" }],
    };
    this.gridApi.setGridOption("deltaSort", true);
    const startTime = new Date().getTime();
    this.gridApi.applyTransaction(transaction);
    document.getElementById("transactionDuration")!.textContent =
      `${new Date().getTime() - startTime} ms`;
  }

  addDefault() {
    const transaction = {
      add: getRowData(1).map((row) => ({ ...row, updatedBy: "default" })),
      update: [{ id: 2, make: "Default", updatedBy: "default" }],
    };
    this.gridApi.setGridOption("deltaSort", false);
    const startTime = new Date().getTime();
    this.gridApi.applyTransaction(transaction);
    document.getElementById("transactionDuration")!.textContent =
      `${new Date().getTime() - startTime} ms`;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

let lastGen = 0;
const generateItem = (id = lastGen++) => {
  return {
    id,
    sort: Math.floor(Math.random() * 3 + 2000),
    sort1: Math.floor(Math.random() * 3 + 2000),
    sort2: Math.floor(Math.random() * 100000 + 2000),
  };
};
const getRowData = (rows = 10) =>
  new Array(rows).fill(undefined).map((_) => generateItem());
