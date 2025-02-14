import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  TextFilterModule,
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
    [columnTypes]="columnTypes"
    [rowModelType]="rowModelType"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      filter: "agTextColumnFilter",
      minWidth: 220,
    },
    {
      field: "year",
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["reset"],
        debounceMs: 1000,
        maxNumConditions: 1,
      },
    },
    { field: "gold", type: "number" },
    { field: "silver", type: "number" },
    { field: "bronze", type: "number" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    number: { filter: "agNumberColumnFilter" },
  };
  rowModelType: RowModelType = "serverSide";
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
      // get data for request from our fake server
      const response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}
