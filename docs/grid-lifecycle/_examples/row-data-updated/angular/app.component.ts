import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowDataUpdatedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { TAthlete, fetchDataAsync } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <div id="firstDataRendered">
        First Data Rendered: <span class="value">-</span>
      </div>
      <div id="rowDataUpdated">
        Row Data Updated: <span class="value">-</span>
      </div>
      <div>
        <button id="btnReloadData" (click)="onBtnReloadData()">
          Reload Data
        </button>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [loading]="true"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (rowDataUpdated)="onRowDataUpdated($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "name", headerName: "Athlete" },
    { field: "person.age", headerName: "Age" },
    { field: "medals.gold", headerName: "Gold Medals" },
  ];
  rowData!: any[];

  onFirstDataRendered(event: FirstDataRenderedEvent) {
    updateRowCount("firstDataRendered");
    console.log("First Data Rendered");
  }

  onRowDataUpdated(event: RowDataUpdatedEvent<TAthlete>) {
    updateRowCount("rowDataUpdated");
    console.log("Row Data Updated");
  }

  onBtnReloadData() {
    console.log("Reloading Data ...");
    setBtnReloadDataDisabled(true);
    this.gridApi.setGridOption("loading", true);
    fetchDataAsync()
      .then((data) => {
        console.log("Data Reloaded");
        this.gridApi.setGridOption("rowData", data);
      })
      .catch((error) => {
        console.error("Failed to reload data", error);
      })
      .finally(() => {
        this.gridApi.setGridOption("loading", false);
        setBtnReloadDataDisabled(false);
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    console.log("Loading Data ...");
    fetchDataAsync()
      .then((data) => {
        console.log("Data Loaded");
        params.api!.setGridOption("rowData", data);
      })
      .catch((error) => {
        console.error("Failed to load data", error);
      })
      .finally(() => {
        params.api!.setGridOption("loading", false);
        setBtnReloadDataDisabled(false);
      });
  }
}

const updateRowCount = (id: string) => {
  const element = document.querySelector(`#${id} > .value`);
  element!.textContent = `${new Date().toLocaleTimeString()}`;
};
const setBtnReloadDataDisabled = (disabled: boolean) => {
  (document.getElementById("btnReloadData") as HTMLButtonElement).disabled =
    disabled;
};
