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
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <label
        ><input type="checkbox" id="read-only" (change)="setReadOnly()" />
        Functions Read Only</label
      >
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [pivotMode]="true"
      [sideBar]="sideBar"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [pivotPanelShow]="pivotPanelShow"
      [functionsReadOnly]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      field: "athlete",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "age",
      enableValue: true,
    },
    {
      field: "country",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
      rowGroupIndex: 1,
    },
    {
      field: "year",
      enableRowGroup: true,
      enablePivot: true,
      pivotIndex: 1,
    },
    {
      field: "date",
      minWidth: 180,
      enableRowGroup: true,
      enablePivot: true,
    },
    {
      field: "sport",
      minWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
      rowGroupIndex: 2,
    },
    {
      field: "gold",
      hide: true,
      enableValue: true,
    },
    {
      field: "silver",
      hide: true,
      enableValue: true,
      aggFunc: "sum",
    },
    {
      field: "bronze",
      hide: true,
      enableValue: true,
      aggFunc: "sum",
    },
    {
      headerName: "Total",
      field: "total",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 250,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "columns";
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  pivotPanelShow: "always" | "onlyWhenPivoting" | "never" = "always";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  setReadOnly() {
    this.gridApi.setGridOption(
      "functionsReadOnly",
      (document.getElementById("read-only") as HTMLInputElement).checked,
    );
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    (document.getElementById("read-only") as HTMLInputElement).checked = true;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
