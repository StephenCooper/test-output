import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GetServerSideGroupLevelParamsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowGroupingDisplayType,
  RowModelType,
  ServerSideGroupLevelParams,
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowModelType]="rowModelType"
      [groupTotalRow]="groupTotalRow"
      [groupDisplayType]="groupDisplayType"
      [getRowId]="getRowId"
      [isServerSideGroupOpenByDefault]="isServerSideGroupOpenByDefault"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "sport", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "year", minWidth: 100 },
    { field: "gold", aggFunc: "sum", enableValue: true },
    { field: "silver", aggFunc: "sum", enableValue: true },
    { field: "bronze", aggFunc: "sum", enableValue: true },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
  };
  autoGroupColumnDef: ColDef = {
    flex: 1,
    minWidth: 280,
  };
  rowModelType: RowModelType = "serverSide";
  groupTotalRow: "top" | "bottom" | UseGroupTotalRow = "bottom";
  groupDisplayType: RowGroupingDisplayType = "multipleColumns";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
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

  getRowId = (params: GetRowIdParams) => {
    return Math.random().toString();
  };

  isServerSideGroupOpenByDefault = (
    params: IsServerSideGroupOpenByDefaultParams,
  ) => {
    const route = params.rowNode.getRoute();
    if (!route) {
      return false;
    }
    const routeAsString = route.join(",");
    const routesToOpenByDefault = ["Zimbabwe", "Zimbabwe,Swimming"];
    return routesToOpenByDefault.indexOf(routeAsString) >= 0;
  };
}

function getServerSideDatasource(server: any): IServerSideDatasource {
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
      }, 400);
    },
  };
}
