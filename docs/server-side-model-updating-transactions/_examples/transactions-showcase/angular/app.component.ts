import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  ColumnRowGroupChangedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideGetRowsParams,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ServerSideTransaction,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { getFakeServer, registerObserver } from "./fakeServer";
ModuleRegistry.registerModules([
  TextFilterModule,
  HighlightChangesModule,
  ColumnApiModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="grid-container">
    <div>
      <button id="startUpdates" (click)="startUpdates()">Start Updates</button>
      <button id="stopUpdates" (click)="stopUpdates()">Stop Updates</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [purgeClosedRowNodes]="true"
      [rowModelType]="rowModelType"
      [getChildCount]="getChildCount"
      [getRowId]="getRowId"
      [isServerSideGroupOpenByDefault]="isServerSideGroupOpenByDefault"
      [rowData]="rowData"
      (columnRowGroupChanged)="onColumnRowGroupChanged($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "tradeId" },
    {
      field: "product",
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: "portfolio",
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: "book",
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    { field: "previous", aggFunc: "sum" },
    { field: "current", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    enableCellChangeFlash: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 220,
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  rowModelType: RowModelType = "serverSide";
  rowData!: any[];

  onColumnRowGroupChanged(event: ColumnRowGroupChangedEvent) {
    const colState = event.api.getColumnState();
    const groupedColumns = colState.filter((state) => state.rowGroup);
    groupedColumns.sort((a, b) => a.rowGroupIndex! - b.rowGroupIndex!);
    const groupedFields = groupedColumns.map((col) => col.colId);
    registerObserver({
      transactionFunc: (t: ServerSideTransaction) =>
        this.gridApi.applyServerSideTransactionAsync(t),
      groupedFields: groupedFields.length === 0 ? undefined : groupedFields,
    });
  }

  startUpdates() {
    getFakeServer().randomUpdates();
    disable("#startUpdates", true);
    disable("#stopUpdates", false);
  }

  stopUpdates() {
    getFakeServer().stopUpdates();
    disable("#stopUpdates", true);
    disable("#startUpdates", false);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    disable("#stopUpdates", true);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(getFakeServer());
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
    // register interest in data changes
    registerObserver({
      transactionFunc: (t: ServerSideTransaction) =>
        params.api.applyServerSideTransactionAsync(t),
      groupedFields: ["product", "portfolio", "book"],
    });
  }

  getChildCount = (data: any) => {
    return data ? data.childCount : undefined;
  };

  getRowId = (params: GetRowIdParams) => {
    let rowId = "";
    if (params.parentKeys && params.parentKeys.length) {
      rowId += params.parentKeys.join("-") + "-";
    }
    const groupCols = params.api.getRowGroupColumns();
    if (groupCols.length > params.level) {
      const thisGroupCol = groupCols[params.level];
      rowId += params.data[thisGroupCol.getColDef().field!] + "-";
    }
    if (params.data.tradeId != null) {
      rowId += params.data.tradeId;
    }
    return rowId;
  };

  isServerSideGroupOpenByDefault = (
    params: IsServerSideGroupOpenByDefaultParams,
  ) => {
    const route = params.rowNode.getRoute();
    if (!route) {
      return false;
    }
    const routeAsString = route.join(",");
    return (
      ["Wool", "Wool,Aggressive", "Wool,Aggressive,GL-62502"].indexOf(
        routeAsString,
      ) >= 0
    );
  };
}

function disable(id: string, disabled: boolean) {
  document.querySelector<HTMLInputElement>(id)!.disabled = disabled;
}
function getServerSideDatasource(server: any) {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
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
