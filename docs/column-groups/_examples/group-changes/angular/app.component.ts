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
      <label>
        <button (click)="onBtNoGroups()">No Groups</button>
      </label>
      <label>
        <div class="participant-group legend-box"></div>
        <button (click)="onParticipantInGroupOnly()">
          Participant in Group
        </button>
      </label>
      <label>
        <div class="medals-group legend-box"></div>
        <button (click)="onMedalsInGroupOnly()">Medals in Group</button>
      </label>
      <label>
        <div class="participant-group legend-box"></div>
        <div class="medals-group legend-box"></div>
        <button (click)="onParticipantAndMedalsInGroups()">
          Participant and Medals in Group
        </button>
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [maintainColumnOrder]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", colId: "athlete" },
    { field: "age", colId: "age" },
    { field: "country", colId: "country" },
    { field: "year", colId: "year" },
    { field: "date", colId: "date" },
    { field: "total", colId: "total" },
    { field: "gold", colId: "gold" },
    { field: "silver", colId: "silver" },
    { field: "bronze", colId: "bronze" },
  ];
  defaultColDef: ColDef = {
    initialWidth: 150,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtNoGroups() {
    const columnDefs: ColDef[] = [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "date", colId: "date" },
      { field: "total", colId: "total" },
      { field: "gold", colId: "gold" },
      { field: "silver", colId: "silver" },
      { field: "bronze", colId: "bronze" },
    ];
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onMedalsInGroupOnly() {
    const columnDefs: (ColDef | ColGroupDef)[] = [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "date", colId: "date" },
      {
        headerName: "Medals",
        headerClass: "medals-group",
        children: [
          { field: "total", colId: "total" },
          { field: "gold", colId: "gold" },
          { field: "silver", colId: "silver" },
          { field: "bronze", colId: "bronze" },
        ],
      },
    ];
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onParticipantInGroupOnly() {
    const columnDefs: (ColDef | ColGroupDef)[] = [
      {
        headerName: "Participant",
        headerClass: "participant-group",
        children: [
          { field: "athlete", colId: "athlete" },
          { field: "age", colId: "age" },
          { field: "country", colId: "country" },
          { field: "year", colId: "year" },
          { field: "date", colId: "date" },
        ],
      },
      { field: "total", colId: "total" },
      { field: "gold", colId: "gold" },
      { field: "silver", colId: "silver" },
      { field: "bronze", colId: "bronze" },
    ];
    this.gridApi.setGridOption("columnDefs", columnDefs);
  }

  onParticipantAndMedalsInGroups() {
    const columnDefs: (ColDef | ColGroupDef)[] = [
      {
        headerName: "Participant",
        headerClass: "participant-group",
        children: [
          { field: "athlete", colId: "athlete" },
          { field: "age", colId: "age" },
          { field: "country", colId: "country" },
          { field: "year", colId: "year" },
          { field: "date", colId: "date" },
        ],
      },
      {
        headerName: "Medals",
        headerClass: "medals-group",
        children: [
          { field: "total", colId: "total" },
          { field: "gold", colId: "gold" },
          { field: "silver", colId: "silver" },
          { field: "bronze", colId: "bronze" },
        ],
      },
    ];
    this.gridApi.setGridOption("columnDefs", columnDefs);
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
