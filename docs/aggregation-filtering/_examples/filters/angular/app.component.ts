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
  NumberFilterModule,
  TextFilterModule,
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>suppressAggFilteredOnly:</span>
        <input
          id="suppressAggFilteredOnly"
          type="checkbox"
          (change)="toggleProperty()"
        />
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [groupTotalRow]="groupTotalRow"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "sport", filter: "agTextColumnFilter", floatingFilter: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 300,
  };
  groupTotalRow: "top" | "bottom" | UseGroupTotalRow = "bottom";
  rowData!: any[];

  constructor(private http: HttpClient) {}

  toggleProperty() {
    const enable = document.querySelector<HTMLInputElement>(
      "#suppressAggFilteredOnly",
    )!.checked;
    this.gridApi.setGridOption("suppressAggFilteredOnly", enable);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    params.api.setFilterModel({
      sport: {
        type: "contains",
        filter: "Swimming",
      },
    });

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
