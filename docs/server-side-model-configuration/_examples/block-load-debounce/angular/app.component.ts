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
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
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
    [blockLoadDebounceMillis]="blockLoadDebounceMillis"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "id", maxWidth: 80 },
    { field: "athlete", minWidth: 220 },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "sport", minWidth: 200 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: false,
  };
  rowModelType: RowModelType = "serverSide";
  blockLoadDebounceMillis = 1000;
  rowData!: IOlympicDataWithId[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicDataWithId>) {
    this.http
      .get<
        IOlympicDataWithId[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // adding row id to data
        let idSequence = 0;
        data.forEach(function (item: any) {
          item.id = idSequence++;
        });
        // setup the fake server with entire dataset
        const fakeServer = createFakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = createServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

function createServerSideDatasource(server: any): IServerSideDatasource {
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
      }, 100);
    },
  };
}
function createFakeServer(allData: any[]) {
  return {
    getData: (request: IServerSideGetRowsRequest) => {
      // take a slice of the total rows for requested block
      const rowsForBlock = allData.slice(request.startRow, request.endRow);
      // when row count is known and 'blockLoadDebounceMillis' is set it is possible to
      // quickly skip over blocks while scrolling
      const lastRow = allData.length;
      return {
        success: true,
        rows: rowsForBlock,
        lastRow: lastRow,
      };
    },
  };
}
