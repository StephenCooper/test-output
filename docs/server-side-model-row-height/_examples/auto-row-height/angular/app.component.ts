import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  RowAutoHeightModule,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [rowModelType]="rowModelType"
    [suppressAggFuncInHeader]="true"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Group",
      field: "name",
      rowGroup: true,
      hide: true,
    },
    {
      field: "autoA",
      wrapText: true,
      autoHeight: true,
      aggFunc: "last",
    },
    {
      field: "autoB",
      wrapText: true,
      autoHeight: true,
      aggFunc: "last",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  autoGroupColumnDef: ColDef = {
    flex: 1,
    maxWidth: 200,
  };
  rowModelType: RowModelType = "serverSide";
  rowData!: any[];

  onGridReady(params: GridReadyEvent) {
    // generate data for example
    const data = getData();
    // setup the fake server with entire dataset
    const fakeServer = new FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(fakeServer);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
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
