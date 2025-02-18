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
  ServerSideTransaction,
  ValidationModule,
} from "ag-grid-community";
import {
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { data, dataObservers, randomUpdates } from "./data";
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
      <button id="startUpdates" (click)="startUpdates()">Start Updates</button>
      <button id="stopUpdates" (click)="stopUpdates()">Stop Updates</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [getRowId]="getRowId"
      [asyncTransactionWaitMillis]="asyncTransactionWaitMillis"
      [rowModelType]="rowModelType"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "tradeId" },
    { field: "portfolio" },
    { field: "book" },
    { field: "previous" },
    { field: "current" },
    {
      field: "lastUpdated",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params) => {
        const ts = params.data!.lastUpdated;
        if (ts) {
          const hh_mm_ss = ts.toLocaleString().split(" ")[1];
          const SSS = ts.getMilliseconds();
          return `${hh_mm_ss}:${SSS}`;
        }
        return "";
      },
    },
    { field: "updateCount" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    enableCellChangeFlash: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 220,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    let rowId = "";
    if (params.parentKeys && params.parentKeys.length) {
      rowId += params.parentKeys.join("-") + "-";
    }
    if (params.data.tradeId != null) {
      rowId += params.data.tradeId;
    }
    return rowId;
  };
  asyncTransactionWaitMillis = 1000;
  rowModelType: RowModelType = "serverSide";
  rowData!: any[];

  startUpdates() {
    interval = setInterval(
      () => randomUpdates({ numUpdate: 10, numAdd: 1, numRemove: 1 }),
      10,
    );
    disable("#stopUpdates", false);
    disable("#startUpdates", true);
  }

  stopUpdates() {
    if (interval !== undefined) {
      clearInterval(interval);
    }
    disable("#stopUpdates", true);
    disable("#startUpdates", false);
  }

  onGridReady(params: GridReadyEvent) {
    disable("#stopUpdates", true);
    // setup the fake server
    const server = FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(server);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
    // register interest in data changes
    dataObservers.push((t: ServerSideTransaction) => {
      params.api.applyServerSideTransactionAsync(t);
    });
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
let interval: any;
function disable(id: string, disabled: boolean) {
  document.querySelector<HTMLInputElement>(id)!.disabled = disabled;
}
