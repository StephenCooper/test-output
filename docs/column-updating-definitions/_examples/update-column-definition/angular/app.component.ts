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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <button (click)="setHeaderNames()">Set Header Names</button>
      <button (click)="removeHeaderNames()">Remove Header Names</button>
      <button (click)="setValueFormatters()">Set Value Formatters</button>
      <button (click)="removeValueFormatters()">Remove Value Formatters</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [defaultColDef]="defaultColDef"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  defaultColDef: ColDef = {
    initialWidth: 100,
    filter: true,
  };
  columnDefs: ColDef[] = COL_DEFS;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  setHeaderNames() {
    COL_DEFS.forEach((colDef, index) => {
      colDef.headerName = "C" + index;
    });
    this.gridApi.setGridOption("columnDefs", COL_DEFS);
  }

  removeHeaderNames() {
    COL_DEFS.forEach((colDef) => {
      colDef.headerName = undefined;
    });
    this.gridApi.setGridOption("columnDefs", COL_DEFS);
  }

  setValueFormatters() {
    COL_DEFS.forEach((colDef) => {
      colDef.valueFormatter = function (params) {
        return "[ " + params.value + " ]";
      };
    });
    this.gridApi.setGridOption("columnDefs", COL_DEFS);
  }

  removeValueFormatters() {
    COL_DEFS.forEach((colDef) => {
      colDef.valueFormatter = undefined;
    });
    this.gridApi.setGridOption("columnDefs", COL_DEFS);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}

const COL_DEFS: ColDef<IOlympicData>[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];
