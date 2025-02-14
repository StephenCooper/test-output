import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideDatasource,
  ModuleRegistry,
  RowApiModule,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="updateRows('Michael Phelps')">
        Update All Michael Phelps Records
      </button>
      <button (click)="updateRows('Michael Phelps', '29/08/2004')">
        Update Michael Phelps, 29/08/2004
      </button>
      <button (click)="updateRows('Aleksey Nemov', '01/10/2000')">
        Update Aleksey Nemov, 01/10/2000
      </button>
      <button (click)="updateRows(undefined, '12/08/2012')">
        Update All Records Dated 12/08/2012
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowModelType]="rowModelType"
      [cacheBlockSize]="cacheBlockSize"
      [getRowId]="getRowId"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "date" },
    { field: "country" },
    { field: "version" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    sortable: false,
    enableCellChangeFlash: true,
  };
  rowModelType: RowModelType = "serverSide";
  cacheBlockSize = 75;
  getRowId: GetRowIdFunc = (params) =>
    `${params.data.athlete}-${params.data.date}`;
  rowData!: any[];

  constructor(private http: HttpClient) {}

  updateRows(athlete?: string, date?: string) {
    versionCounter += 1;
    this.gridApi.forEachNode((rowNode) => {
      if (athlete != null && rowNode.data.athlete !== athlete) {
        return;
      }
      if (date != null && rowNode.data.date !== date) {
        return;
      }
      // arbitrarily update some data
      const updated = rowNode.data;
      updated.version =
        versionCounter + " - " + versionCounter + " - " + versionCounter;
      // directly update data in rowNode
      rowNode.updateData(updated);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
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

let versionCounter: number = 0;
const getServerSideDatasource = (server: any): IServerSideDatasource => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersion = response.rows.map((rowData: any) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
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
