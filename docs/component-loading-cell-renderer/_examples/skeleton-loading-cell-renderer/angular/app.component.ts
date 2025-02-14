import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsRequest,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ServerSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowModelType]="rowModelType"
    [suppressServerSideFullWidthLoadingRow]="true"
    [cacheBlockSize]="cacheBlockSize"
    [maxBlocksInCache]="maxBlocksInCache"
    [rowBuffer]="rowBuffer"
    [maxConcurrentDatasourceRequests]="maxConcurrentDatasourceRequests"
    [blockLoadDebounceMillis]="blockLoadDebounceMillis"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", flex: 4 },
    { field: "sport", flex: 4 },
    { field: "year", flex: 3 },
    { field: "gold", aggFunc: "sum", flex: 2 },
    { field: "silver", aggFunc: "sum", flex: 2 },
    { field: "bronze", aggFunc: "sum", flex: 2 },
  ];
  defaultColDef: ColDef = {
    minWidth: 75,
  };
  rowModelType: RowModelType = "serverSide";
  cacheBlockSize = 5;
  maxBlocksInCache = 0;
  rowBuffer = 0;
  maxConcurrentDatasourceRequests = 1;
  blockLoadDebounceMillis = 200;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // add id to data
        let idSequence = 0;
        data.forEach((item: any) => {
          item.id = idSequence++;
        });
        const server: any = getFakeServer(data);
        const datasource: IServerSideDatasource =
          getServerSideDatasource(server);
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      // adding delay to simulate real server call
      setTimeout(() => {
        const response = server.getResponse(params.request);
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
      }, 4000);
    },
  };
}
function getFakeServer(allData: any[]): any {
  return {
    getResponse: (request: IServerSideGetRowsRequest) => {
      console.log(
        "asking for rows: " + request.startRow + " to " + request.endRow,
      );
      // take a slice of the total rows
      const rowsThisPage = allData.slice(request.startRow, request.endRow);
      const lastRow = allData.length;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    },
  };
}
