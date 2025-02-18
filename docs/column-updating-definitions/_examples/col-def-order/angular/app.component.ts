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
      <button (click)="setColsA()">Column Set A</button>
      <button (click)="setColsB()">Column Set B</button>
      <button (click)="clearColDefs()">Clear</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [defaultColDef]="defaultColDef"
      [maintainColumnOrder]="true"
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
  columnDefs: ColDef[] = getColumnDefsA();
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  setColsA() {
    this.gridApi.setGridOption("columnDefs", getColumnDefsA());
  }

  setColsB() {
    this.gridApi.setGridOption("columnDefs", getColumnDefsB());
  }

  clearColDefs() {
    this.gridApi.setGridOption("columnDefs", []);
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

function getColumnDefsA(): ColDef[] {
  return [
    { field: "athlete", headerName: "A Athlete" },
    { field: "age", headerName: "A Age" },
    { field: "country", headerName: "A Country" },
    { field: "sport", headerName: "A Sport" },
    { field: "year", headerName: "A Year" },
    { field: "date", headerName: "A Date" },
    { field: "gold", headerName: "A Gold" },
    { field: "silver", headerName: "A Silver" },
    { field: "bronze", headerName: "A Bronze" },
    { field: "total", headerName: "A Total" },
  ];
}
function getColumnDefsB(): ColDef[] {
  return [
    { field: "gold", headerName: "B Gold" },
    { field: "silver", headerName: "B Silver" },
    { field: "bronze", headerName: "B Bronze" },
    { field: "total", headerName: "B Total" },
    { field: "athlete", headerName: "B Athlete" },
    { field: "age", headerName: "B Age" },
    { field: "country", headerName: "B Country" },
    { field: "sport", headerName: "B Sport" },
    { field: "year", headerName: "B Year" },
    { field: "date", headerName: "B Date" },
  ];
}
