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
  IServerSideDatasource,
  IServerSideSelectionState,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicDataWithId } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="saveSelectionState()">Save Selection</button>
      <button (click)="loadSelectionState()">Load Selection</button>
      <button (click)="clearSelectionState()">Clear Selection</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      [isServerSideGroupOpenByDefault]="isServerSideGroupOpenByDefault"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [rowModelType]="rowModelType"
      [rowSelection]="rowSelection"
      [suppressAggFuncInHeader]="true"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicDataWithId>;

  columnDefs: ColDef[] = [
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "year", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "athlete", hide: true },
    { field: "sport", enableRowGroup: true, filter: "agTextColumnFilter" },
    { field: "gold", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "silver", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "bronze", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    floatingFilter: true,
    flex: 1,
    minWidth: 120,
  };
  getRowId: GetRowIdFunc = (params) => {
    if (params.data.id != null) {
      return "leaf-" + params.data.id;
    }
    const rowGroupCols = params.api.getRowGroupColumns();
    const rowGroupColIds = rowGroupCols.map((col) => col.getId()).join("-");
    const thisGroupCol = rowGroupCols[params.level];
    return (
      "group-" +
      rowGroupColIds +
      "-" +
      (params.parentKeys || []).join("-") +
      params.data[thisGroupCol.getColDef().field as keyof IOlympicDataWithId]
    );
  };
  isServerSideGroupOpenByDefault: (
    params: IsServerSideGroupOpenByDefaultParams,
  ) => boolean = (params) => {
    return (
      params.rowNode.key === "United States" ||
      String(params.rowNode.key) === "2004"
    );
  };
  autoGroupColumnDef: ColDef = {
    field: "athlete",
    flex: 1,
    minWidth: 240,
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  rowModelType: RowModelType = "serverSide";
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  rowData!: IOlympicDataWithId[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params) {
    params.api.setServerSideSelectionState({
      selectAll: true,
      toggledNodes: [
        "group-country-year-United States",
        "group-country-year-United States2004",
      ],
    });
  }

  saveSelectionState() {
    selectionState =
      this.gridApi.getServerSideSelectionState() as IServerSideSelectionState;
    console.log(JSON.stringify(selectionState, null, 2));
  }

  loadSelectionState() {
    this.gridApi.setServerSideSelectionState(selectionState);
  }

  clearSelectionState() {
    this.gridApi.setServerSideSelectionState({
      selectAll: false,
      toggledNodes: [],
    });
  }

  onGridReady(params: GridReadyEvent<IOlympicDataWithId>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicDataWithId[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // assign a unique ID to each data item
        data.forEach(function (item: any, index: number) {
          item.id = index;
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

let selectionState: IServerSideSelectionState = {
  selectAll: false,
  toggledNodes: [],
};
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
