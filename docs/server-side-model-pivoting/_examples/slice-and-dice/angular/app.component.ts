import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getCountries } from "./countries";
import { CustomAgeFilter } from "./customAgeFilter";
import { createFakeServer, createServerSideDatasource } from "./server";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CustomFilterModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
  RowGroupingPanelModule,
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
    [rowModelType]="rowModelType"
    [rowGroupPanelShow]="rowGroupPanelShow"
    [pivotPanelShow]="pivotPanelShow"
    [sideBar]="true"
    [maxConcurrentDatasourceRequests]="maxConcurrentDatasourceRequests"
    [maxBlocksInCache]="maxBlocksInCache"
    [purgeClosedRowNodes]="true"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", enableRowGroup: true, filter: false },
    {
      field: "age",
      enableRowGroup: true,
      enablePivot: true,
      filter: CustomAgeFilter,
    },
    {
      field: "country",
      enableRowGroup: true,
      enablePivot: true,
      rowGroup: true,
      hide: true,
      filter: "agSetColumnFilter",
      filterParams: { values: countries },
    },
    {
      field: "year",
      enableRowGroup: true,
      enablePivot: true,
      rowGroup: true,
      hide: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["2000", "2002", "2004", "2006", "2008", "2010", "2012"],
      },
    },
    { field: "sport", enableRowGroup: true, enablePivot: true, filter: false },
    { field: "gold", aggFunc: "sum", filter: false, enableValue: true },
    { field: "silver", aggFunc: "sum", filter: false, enableValue: true },
    { field: "bronze", aggFunc: "sum", filter: false, enableValue: true },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    // restrict what aggregation functions the columns can have,
    // include a custom function 'random' that just returns a
    // random number
    allowedAggFuncs: ["sum", "min", "max", "random"],
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    width: 180,
  };
  rowModelType: RowModelType = "serverSide";
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  pivotPanelShow: "always" | "onlyWhenPivoting" | "never" = "always";
  maxConcurrentDatasourceRequests = 1;
  maxBlocksInCache = 2;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

const countries = getCountries();
