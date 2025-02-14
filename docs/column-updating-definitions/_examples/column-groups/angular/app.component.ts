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
      <button (click)="onBtSetA()">First Column Set</button>
      <button (click)="onBtSetB()">Second Column Set</button>
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
  };
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Group A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtSetA() {
    this.gridApi.setGridOption("columnDefs", createColSetA());
  }

  onBtSetB() {
    this.gridApi.setGridOption("columnDefs", createColSetB());
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

function createColSetA(): ColGroupDef[] {
  return [
    {
      headerName: "Group A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ];
}
function createColSetB(): ColGroupDef[] {
  return [
    {
      headerName: "GROUP A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
        { field: "extraA" },
        { field: "extraB", columnGroupShow: "open" },
      ],
    },
  ];
}
