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
  ModuleRegistry,
  PaginationModule,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  PaginationModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicDataWithId } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowModelType]="rowModelType"
    [pagination]="true"
    [paginationPageSize]="paginationPageSize"
    [cacheBlockSize]="cacheBlockSize"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "id", maxWidth: 75 },
    { field: "athlete", minWidth: 190 },
    { field: "age" },
    { field: "year" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 90,
  };
  rowModelType: RowModelType = "serverSide";
  paginationPageSize = 20;
  cacheBlockSize = 10;
  rowData!: IOlympicDataWithId[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicDataWithId>) {
    this.http
      .get<
        IOlympicDataWithId[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // add id to data
        let idSequence = 1;
        data.forEach(function (item: any) {
          item.id = idSequence++;
        });
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
      }, 200);
    },
  };
}
