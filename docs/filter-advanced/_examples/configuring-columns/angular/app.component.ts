import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderValueGetterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <button
        id="includeHiddenColumns"
        (click)="onIncludeHiddenColumnsToggled()"
      >
        Include Hidden Columns
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [enableAdvancedFilter]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      field: "athlete",
      filterParams: {
        caseSensitive: true,
        filterOptions: ["contains"],
      },
    },
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", hide: true },
    { field: "age", minWidth: 100, filter: false },
    {
      headerName: "Medals (+)",
      children: [
        { field: "gold", minWidth: 100 },
        { field: "silver", minWidth: 100 },
        { field: "bronze", minWidth: 100 },
      ],
    },
    {
      headerName: "Medals (-)",
      children: [
        {
          field: "gold",
          headerValueGetter: (
            params: HeaderValueGetterParams<IOlympicData, number>,
          ) => (params.location === "advancedFilter" ? "Gold (-)" : "Gold"),
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "silver",
          headerValueGetter: (
            params: HeaderValueGetterParams<IOlympicData, number>,
          ) => (params.location === "advancedFilter" ? "Silver (-)" : "Silver"),
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "bronze",
          headerValueGetter: (
            params: HeaderValueGetterParams<IOlympicData, number>,
          ) => (params.location === "advancedFilter" ? "Bronze (-)" : "Bronze"),
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
      ],
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
    filter: true,
  };
  groupDefaultExpanded = 1;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onIncludeHiddenColumnsToggled() {
    includeHiddenColumns = !includeHiddenColumns;
    this.gridApi.setGridOption(
      "includeHiddenColumnsInAdvancedFilter",
      includeHiddenColumns,
    );
    document.querySelector("#includeHiddenColumns")!.textContent =
      `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

function valueGetter(params: ValueGetterParams<IOlympicData, number>) {
  return params.data ? params.data[params.colDef.field!] * -1 : null;
}
let includeHiddenColumns = false;
