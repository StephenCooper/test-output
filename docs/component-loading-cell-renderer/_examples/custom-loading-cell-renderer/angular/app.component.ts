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
  NumberEditorModule,
  NumberFilterModule,
  RowModelType,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { ServerSideRowModelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CustomLoadingCellRenderer } from "./custom-loading-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomLoadingCellRenderer],
  template: `<div
    style="height: 100%; padding-top: 25px; box-sizing: border-box"
  >
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [loadingCellRenderer]="loadingCellRenderer"
      [loadingCellRendererParams]="loadingCellRendererParams"
      [rowModelType]="rowModelType"
      [cacheBlockSize]="cacheBlockSize"
      [maxBlocksInCache]="maxBlocksInCache"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "id" },
    { field: "athlete", width: 150 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  loadingCellRenderer: any = CustomLoadingCellRenderer;
  loadingCellRendererParams: any = {
    loadingMessage: "One moment please...",
  };
  rowModelType: RowModelType = "serverSide";
  cacheBlockSize = 20;
  maxBlocksInCache = 10;
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
      // if on or after the last page, work out the last row.
      const lastRow =
        allData.length <= (request.endRow || 0) ? allData.length : -1;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    },
  };
}
