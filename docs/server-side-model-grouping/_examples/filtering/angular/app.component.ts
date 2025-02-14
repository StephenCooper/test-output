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
  NumberFilterModule,
  RowModelType,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  NumberFilterModule,
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
    [autoGroupColumnDef]="autoGroupColumnDef"
    [serverSideOnlyRefreshFilteredGroups]="true"
    [rowModelType]="rowModelType"
    [cacheBlockSize]="cacheBlockSize"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    {
      field: "year",
      minWidth: 100,
      filter: "agNumberColumnFilter",
      floatingFilter: true,
    },
    {
      field: "gold",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableValue: true,
    },
    {
      field: "silver",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableValue: true,
    },
    {
      field: "bronze",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableValue: true,
    },
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
  cacheBlockSize = 5;
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
