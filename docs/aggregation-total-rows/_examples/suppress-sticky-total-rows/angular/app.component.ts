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
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>suppressStickyTotalRow:</span>
        <select id="input-property-value" (change)="onChange()">
          <option value="false">false</option>
          <option value="true">true</option>
          <option value="grand">"grand"</option>
          <option value="group">"group"</option>
        </select>
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [groupTotalRow]="groupTotalRow"
      [grandTotalRow]="grandTotalRow"
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
  groupDefaultExpanded = -1;
  groupTotalRow: "top" | "bottom" | UseGroupTotalRow = "bottom";
  grandTotalRow: "top" | "bottom" = "bottom";
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onChange() {
    const suppressStickyTotalRow = document.querySelector<HTMLInputElement>(
      "#input-property-value",
    )!.value;
    if (
      suppressStickyTotalRow === "grand" ||
      suppressStickyTotalRow === "group"
    ) {
      this.gridApi.setGridOption(
        "suppressStickyTotalRow",
        suppressStickyTotalRow,
      );
    } else if (suppressStickyTotalRow === "true") {
      this.gridApi.setGridOption("suppressStickyTotalRow", true);
    } else {
      this.gridApi.setGridOption("suppressStickyTotalRow", false);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
