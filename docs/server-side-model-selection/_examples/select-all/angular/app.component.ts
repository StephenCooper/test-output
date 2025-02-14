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
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  PaginationModule,
  RowGroupingModule,
  ServerSideRowModelModule,
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
    <div class="example-header">
      <label>
        <span>Select All:</span>
        <select id="input-select-all" (change)="onSelectAllChanged()">
          <option>all</option>
          <option>filtered</option>
          <option>currentPage</option>
        </select>
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [rowModelType]="rowModelType"
      [rowSelection]="rowSelection"
      [suppressAggFuncInHeader]="true"
      [pagination]="true"
      [paginationPageSize]="paginationPageSize"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicDataWithId>;

  columnDefs: ColDef[] = [
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "year", enableRowGroup: true },
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
  autoGroupColumnDef: ColDef = {
    field: "athlete",
    flex: 1,
    minWidth: 240,
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  rowModelType: RowModelType = "serverSide";
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    selectAll: "all",
  };
  paginationPageSize = 20;
  rowData!: IOlympicDataWithId[];

  constructor(private http: HttpClient) {}

  onSelectAllChanged() {
    this.gridApi.setGridOption("rowSelection", {
      mode: "multiRow",
      selectAll: document.querySelector<HTMLSelectElement>("#input-select-all")!
        .value as any,
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
