import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  IServerSideDatasource,
  ModuleRegistry,
  RowModelType,
  StoreRefreshedEvent,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowGroupingModule,
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
      <div>Version on server: <span id="version-indicator">1</span></div>
      <button (click)="refreshCache(undefined)">Refresh Rows</button>

      <label><input type="checkbox" id="purge" /> Purge</label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [getRowId]="getRowId"
      [rowModelType]="rowModelType"
      [suppressAggFuncInHeader]="true"
      [rowData]="rowData"
      (storeRefreshed)="onStoreRefreshed($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "country" },
    { field: "year" },
    { field: "version" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    enableCellChangeFlash: true,
  };
  autoGroupColumnDef: ColDef = {
    flex: 1,
    minWidth: 280,
    field: "athlete",
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    const data = params.data;
    const parts = [];
    if (data.country != null) {
      parts.push(data.country);
    }
    if (data.year != null) {
      parts.push(data.year);
    }
    if (data.id != null) {
      parts.push(data.id);
    }
    return parts.join("-");
  };
  rowModelType: RowModelType = "serverSide";
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onStoreRefreshed(event: StoreRefreshedEvent) {
    console.log("Refresh finished for store with route:", event.route);
  }

  refreshCache(route?: string[]) {
    const purge = !!(document.querySelector("#purge") as HTMLInputElement)
      .checked;
    this.gridApi.refreshServerSide({ route: route, purge: purge });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // give each data item an ID
        const dataWithId = data.map((d: any, idx: number) => ({
          ...d,
          id: idx,
        }));
        allData = dataWithId;
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(allData);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
        beginPeriodicallyModifyingData();
      });
  }
}

let allData: any[];
let versionCounter = 1;
const updateChangeIndicator = () => {
  const el = document.querySelector("#version-indicator") as HTMLInputElement;
  el.textContent = `${versionCounter}`;
};
const beginPeriodicallyModifyingData = () => {
  setInterval(() => {
    versionCounter += 1;
    allData = allData.map((data) => ({
      ...data,
      version: versionCounter + " - " + versionCounter + " - " + versionCounter,
    }));
    updateChangeIndicator();
  }, 4000);
};
const getServerSideDatasource = (server: any): IServerSideDatasource => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersionAndGroupProperties = response.rows.map(
        (rowData: any) => {
          const rowProperties: any = {
            ...rowData,
            version:
              versionCounter + " - " + versionCounter + " - " + versionCounter,
          };
          // for unique-id purposes in the client, we also want to attach
          // the parent group keys
          const groupProperties = Object.fromEntries(
            params.request.groupKeys.map((groupKey, index) => {
              const col = params.request.rowGroupCols[index];
              const field = col.id;
              return [field, groupKey];
            }),
          );
          return {
            ...rowProperties,
            ...groupProperties,
          };
        },
      );
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersionAndGroupProperties,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};
