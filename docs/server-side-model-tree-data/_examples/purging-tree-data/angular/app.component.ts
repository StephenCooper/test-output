import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
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
      <button (click)="refreshCache([])">Refresh Everything</button>
      <button (click)="refreshCache(['Kathryn Powers', 'Mabel Ward'])">
        Refresh ['Kathryn Powers','Mabel Ward']
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowModelType]="rowModelType"
      [treeData]="true"
      [cacheBlockSize]="cacheBlockSize"
      [isServerSideGroupOpenByDefault]="isServerSideGroupOpenByDefault"
      [isServerSideGroup]="isServerSideGroup"
      [getServerSideGroupKey]="getServerSideGroupKey"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "employmentType" },
    { field: "startDate" },
  ];
  defaultColDef: ColDef = {
    width: 235,
    flex: 1,
    sortable: false,
  };
  autoGroupColumnDef: ColDef = {
    field: "employeeName",
  };
  rowModelType: RowModelType = "serverSide";
  cacheBlockSize = 10;
  isServerSideGroupOpenByDefault: (
    params: IsServerSideGroupOpenByDefaultParams,
  ) => boolean = (params: IsServerSideGroupOpenByDefaultParams) => {
    const isKathrynPowers =
      params.rowNode.level == 0 && params.data.employeeName == "Kathryn Powers";
    const isMabelWard =
      params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
    return isKathrynPowers || isMabelWard;
  };
  isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    // indicate if node is a group
    return dataItem.group;
  };
  getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    // specify which group key to use
    return dataItem.employeeName;
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  refreshCache(route: string[]) {
    this.gridApi.refreshServerSide({ route: route, purge: true });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/tree-data.json")
      .subscribe((data) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

function createFakeServer(fakeServerData: any[]) {
  const fakeServer = {
    getData: (request: IServerSideGetRowsRequest) => {
      function extractRowsFromData(groupKeys: string[], data: any[]): any {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.underlings,
              employeeId: d.employeeId + "",
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              startDate: d.startDate,
            };
          });
        }
        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeName === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].underlings.slice(),
            );
          }
        }
      }
      return extractRowsFromData(request.groupKeys, fakeServerData);
    },
  };
  return fakeServer;
}
function createServerSideDatasource(fakeServer: any) {
  const dataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("ServerSideDatasource.getRows: params = ", params);
      const request = params.request;
      const allRows = fakeServer.getData(request);
      const doingInfinite = request.startRow != null && request.endRow != null;
      const result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      console.log("getRows: result = ", result);
      setTimeout(() => {
        params.success(result);
      }, 500);
    },
  };
  return dataSource;
}
