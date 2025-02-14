import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideGetRowsParams,
  ModuleRegistry,
  RowModelType,
  RowSelectionOptions,
  ServerSideTransaction,
  ServerSideTransactionResult,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { data } from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="addRow()">Add Above Selected</button>
      <button (click)="updateRow()">Update Selected</button>
      <button (click)="removeRow()">Remove Selected</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [getRowId]="getRowId"
      [rowSelection]="rowSelection"
      [rowModelType]="rowModelType"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "tradeId" },
    { field: "portfolio" },
    { field: "book" },
    { field: "current" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    enableCellChangeFlash: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 220,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => `${params.data.tradeId}`;
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
  };
  rowModelType: RowModelType = "serverSide";
  rowData!: any[];

  addRow() {
    const selectedRows = this.gridApi.getSelectedNodes();
    if (selectedRows.length === 0) {
      console.warn("[Example] No row selected.");
      return;
    }
    const rowIndex = selectedRows[0].rowIndex;
    const transaction: ServerSideTransaction = {
      addIndex: rowIndex != null ? rowIndex : undefined,
      add: [createRow()],
    };
    const result = this.gridApi.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }

  updateRow() {
    const selectedRows = this.gridApi.getSelectedNodes();
    if (selectedRows.length === 0) {
      console.warn("[Example] No row selected.");
      return;
    }
    const transaction: ServerSideTransaction = {
      update: [{ ...selectedRows[0].data, current: getNewValue() }],
    };
    const result = this.gridApi.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }

  removeRow() {
    const selectedRows = this.gridApi.getSelectedNodes();
    if (selectedRows.length === 0) {
      console.warn("[Example] No row selected.");
      return;
    }
    const transaction: ServerSideTransaction = {
      remove: [selectedRows[0].data],
    };
    const result = this.gridApi.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    // setup the fake server
    const server = new FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(server);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
  }
}

function getServerSideDatasource(server: any) {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 300);
    },
  };
}
function logResults(
  transaction: ServerSideTransaction,
  result?: ServerSideTransactionResult,
) {
  console.log(
    "[Example] - Applied transaction:",
    transaction,
    "Result:",
    result,
  );
}
function getNewValue() {
  return Math.floor(Math.random() * 100000) + 100;
}
let serverCurrentTradeId = data.length;
function createRow() {
  return {
    portfolio: "Aggressive",
    product: "Aluminium",
    book: "GL-62472",
    tradeId: ++serverCurrentTradeId,
    current: getNewValue(),
  };
}
