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
  PaginationModule,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  PaginationModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="getDisplayedRowAtIndex()">Get Displayed Row 0</button>
      <button (click)="getDisplayedRowCount()">Get Displayed Row Count</button>
      <button (click)="printAllDisplayedRows()">
        Print All Displayed Rows
      </button>
      <button (click)="printPageDisplayedRows()">
        Print Page Displayed Rows
      </button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [pagination]="true"
      [paginationAutoPageSize]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { headerName: "Group", valueGetter: "data.country.charAt(0)" },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 180 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  getDisplayedRowAtIndex() {
    const rowNode = this.gridApi.getDisplayedRowAtIndex(0)!;
    console.log(
      "getDisplayedRowAtIndex(0) => " +
        rowNode.data!.athlete +
        " " +
        rowNode.data!.year,
    );
  }

  getDisplayedRowCount() {
    const count = this.gridApi.getDisplayedRowCount();
    console.log("getDisplayedRowCount() => " + count);
  }

  printAllDisplayedRows() {
    const count = this.gridApi.getDisplayedRowCount();
    console.log("## printAllDisplayedRows");
    for (let i = 0; i < count; i++) {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(i)!;
      console.log("row " + i + " is " + rowNode.data!.athlete);
    }
  }

  printPageDisplayedRows() {
    const rowCount = this.gridApi.getDisplayedRowCount();
    const lastGridIndex = rowCount - 1;
    const currentPage = this.gridApi.paginationGetCurrentPage();
    const pageSize = this.gridApi.paginationGetPageSize();
    const startPageIndex = currentPage * pageSize;
    let endPageIndex = (currentPage + 1) * pageSize - 1;
    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }
    console.log("## printPageDisplayedRows");
    for (let i = startPageIndex; i <= endPageIndex; i++) {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(i)!;
      console.log("row " + i + " is " + rowNode.data!.athlete);
    }
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data.slice(0, 100);
      });
  }
}
