import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <label><input type="checkbox" id="failLoad" /> Make Loads Fail</label>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button (click)="onBtRetry()">Retry Failed Loads</button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button (click)="onBtReset()">Reset Entire Grid</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowModelType]="rowModelType"
      [maxConcurrentDatasourceRequests]="maxConcurrentDatasourceRequests"
      [suppressAggFuncInHeader]="true"
      [purgeClosedRowNodes]="true"
      [cacheBlockSize]="cacheBlockSize"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      // demonstrating the use of valueGetters
      colId: "country",
      valueGetter: "data.country",
      rowGroup: true,
      hide: true,
    },
    { field: "sport", rowGroup: true, hide: true },
    { field: "year", minWidth: 100 },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
  };
  autoGroupColumnDef: ColDef = {
    flex: 1,
    minWidth: 280,
    field: "athlete",
  };
  rowModelType: RowModelType = "serverSide";
  maxConcurrentDatasourceRequests = 1;
  cacheBlockSize = 20;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtRetry() {
    this.gridApi.retryServerSideLoads();
  }

  onBtReset() {
    this.gridApi.refreshServerSide({ purge: true });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
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
      }, 1000);
    },
  };
}
