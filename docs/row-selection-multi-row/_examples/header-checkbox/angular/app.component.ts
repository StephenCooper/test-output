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
  PaginationModule,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  PaginationModule,
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 10px">
      <label style="margin-right: 10px">
        <span>Select All Mode: </span>
        <select id="select-all-mode" (change)="updateSelectAllMode()">
          <option value="all">all</option>
          <option value="filtered">filtered</option>
          <option value="currentPage">currentPage</option>
        </select>
      </label>
      <label>
        <span>Filter: </span>
        <input
          type="text"
          (input)="onQuickFilterChanged()"
          id="quickFilter"
          placeholder="quick filter..."
        />
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [pagination]="true"
      [paginationAutoPageSize]="true"
      [rowSelection]="rowSelection"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { headerName: "Athlete", field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    selectAll: "all",
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onQuickFilterChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      document.querySelector<HTMLInputElement>("#quickFilter")?.value,
    );
  }

  updateSelectAllMode() {
    const selectAll =
      document.querySelector<HTMLSelectElement>("#select-all-mode")?.value ??
      "all";
    this.gridApi.setGridOption("rowSelection", {
      mode: "multiRow",
      selectAll: selectAll as "all" | "filtered" | "currentPage",
    });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
