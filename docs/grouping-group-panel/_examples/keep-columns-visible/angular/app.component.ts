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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>suppressGroupChangesColumnVisibility:</span>
        <select id="visibility-behaviour" (change)="onPropertyChange()">
          <option value="false">false</option>
          <option value="true">true</option>
          <option value="suppressHideOnGroup">"suppressHideOnGroup"</option>
          <option value="suppressShowOnUngroup">"suppressShowOnUngroup"</option>
        </select>
      </label>
      <button (click)="resetCols()">Reset Column Visibility</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [suppressDragLeaveHidesColumns]="true"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "country", enableRowGroup: true },
    { field: "year", enableRowGroup: true },
    { field: "athlete", minWidth: 180 },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onPropertyChange() {
    const prop = (
      document.querySelector("#visibility-behaviour") as HTMLSelectElement
    ).value;
    if (prop === "true" || prop === "false") {
      this.gridApi.setGridOption(
        "suppressGroupChangesColumnVisibility",
        prop === "true",
      );
    } else {
      this.gridApi.setGridOption(
        "suppressGroupChangesColumnVisibility",
        prop as "suppressHideOnGroup" | "suppressShowOnUngroup",
      );
    }
  }

  resetCols() {
    this.gridApi.setGridOption("columnDefs", [
      { field: "country", enableRowGroup: true, hide: false },
      { field: "year", enableRowGroup: true, hide: false },
      { field: "athlete", minWidth: 180, hide: false },
      { field: "total", hide: false },
    ]);
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
