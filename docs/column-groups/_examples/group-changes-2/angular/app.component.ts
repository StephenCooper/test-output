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
} from "ag-grid-community";
ModuleRegistry.registerModules([
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
      <button (click)="onBtNormalCols()">Normal Cols</button>
      <button (click)="onBtExtraCols()">Extra Cols</button>
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
    width: 150,
  };
  columnDefs: ColDef[] = createNormalColDefs();
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtNormalCols() {
    this.gridApi.setGridOption("columnDefs", createNormalColDefs());
  }

  onBtExtraCols() {
    this.gridApi.setGridOption("columnDefs", createExtraColDefs());
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

function createNormalColDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
      ],
    },
    { field: "age", colId: "age" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
}
function createExtraColDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
        { field: "region1", colId: "region1" },
        { field: "region2", colId: "region2" },
      ],
    },
    { field: "age", colId: "age" },
    { field: "distance", colId: "distance" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
}
