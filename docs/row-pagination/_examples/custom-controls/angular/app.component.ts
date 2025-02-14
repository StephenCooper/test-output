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
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule,
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
      <div>
        <button (click)="onBtFirst()">To First</button>
        <button (click)="onBtLast()" id="btLast">To Last</button>
        <button (click)="onBtPrevious()">To Previous</button>
        <button (click)="onBtNext()">To Next</button>
        <button (click)="onBtPageFive()">To Page 5</button>
        <button (click)="onBtPageFifty()">To Page 50</button>
      </div>

      <div style="margin-top: 6px">
        <span class="label">Last Page Found:</span>
        <span class="value" id="lbLastPageFound">-</span>
        <span class="label">Page Size:</span>
        <span class="value" id="lbPageSize">-</span>
        <span class="label">Total Pages:</span>
        <span class="value" id="lbTotalPages">-</span>
        <span class="label">Current Page:</span>
        <span class="value" id="lbCurrentPage">-</span>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowSelection]="rowSelection"
      [paginationPageSize]="paginationPageSize"
      [paginationPageSizeSelector]="paginationPageSizeSelector"
      [pagination]="true"
      [suppressPaginationPanel]="true"
      [suppressScrollOnNewData]="true"
      [rowData]="rowData"
      (paginationChanged)="onPaginationChanged($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    // this row just shows the row index, doesn't use any data from the row
    {
      headerName: "#",
      width: 70,
      valueFormatter: (params: ValueFormatterParams) => {
        return `${parseInt(params.node!.id!) + 1}`;
      },
    },
    { headerName: "Athlete", field: "athlete", width: 150 },
    { headerName: "Age", field: "age", width: 90 },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "Year", field: "year", width: 90 },
    { headerName: "Date", field: "date", width: 110 },
    { headerName: "Sport", field: "sport", width: 110 },
    { headerName: "Gold", field: "gold", width: 100 },
    { headerName: "Silver", field: "silver", width: 100 },
    { headerName: "Bronze", field: "bronze", width: 100 },
    { headerName: "Total", field: "total", width: 100 },
  ];
  defaultColDef: ColDef = {
    filter: true,
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    checkboxes: true,
    headerCheckbox: true,
  };
  paginationPageSize = 500;
  paginationPageSizeSelector: number[] | boolean = [100, 500, 1000];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onPaginationChanged() {
    console.log("onPaginationPageLoaded");
    // Workaround for bug in events order
    if (this.gridApi) {
      setText("#lbLastPageFound", this.gridApi.paginationIsLastPageFound());
      setText("#lbPageSize", this.gridApi.paginationGetPageSize());
      // we +1 to current page, as pages are zero based
      setText("#lbCurrentPage", this.gridApi.paginationGetCurrentPage() + 1);
      setText("#lbTotalPages", this.gridApi.paginationGetTotalPages());
      setLastButtonDisabled(!this.gridApi.paginationIsLastPageFound());
    }
  }

  onBtFirst() {
    this.gridApi.paginationGoToFirstPage();
  }

  onBtLast() {
    this.gridApi.paginationGoToLastPage();
  }

  onBtNext() {
    this.gridApi.paginationGoToNextPage();
  }

  onBtPrevious() {
    this.gridApi.paginationGoToPreviousPage();
  }

  onBtPageFive() {
    // we say page 4, as the first page is zero
    this.gridApi.paginationGoToPage(4);
  }

  onBtPageFifty() {
    // we say page 49, as the first page is zero
    this.gridApi.paginationGoToPage(49);
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

function setText(selector: string, text: any) {
  (document.querySelector(selector) as any).innerHTML = text;
}
function setLastButtonDisabled(disabled: boolean) {
  (document.querySelector("#btLast") as any).disabled = disabled;
}
