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
  ISetFilter,
  ISetFilterParams,
  ModuleRegistry,
  SetFilterValuesFuncParams,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div id="container">
    <div id="header">
      <button (click)="useList1()">
        Use <code>['Elephant', 'Lion', 'Monkey']</code>
      </button>
      <button (click)="useList2()">
        Use <code>['Elephant', 'Giraffe', 'Tiger']</code>
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      colId: "array",
      headerName: "Values Array",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: arrayFilterParams,
    },
    {
      colId: "callback",
      headerName: "Values Callback",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: callbackFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData: any[] | null = getData();

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }

  useList1() {
    console.log("Updating values to " + list1);
    valuesArray.length = 0;
    list1.forEach((value) => {
      valuesArray.push(value);
    });
    this.gridApi.getColumnFilterInstance<ISetFilter>("array").then((filter) => {
      filter!.refreshFilterValues();
      valuesCallbackList = list1;
    });
  }

  useList2() {
    console.log("Updating values to " + list2);
    valuesArray.length = 0;
    list2.forEach((value) => {
      valuesArray.push(value);
    });
    this.gridApi.getColumnFilterInstance<ISetFilter>("array").then((filter) => {
      filter!.refreshFilterValues();
      valuesCallbackList = list2;
    })!;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

const list1 = ["Elephant", "Lion", "Monkey"];
const list2 = ["Elephant", "Giraffe", "Tiger"];
const valuesArray = list1.slice();
let valuesCallbackList = list1;
function valuesCallback(params: SetFilterValuesFuncParams) {
  setTimeout(() => {
    params.success(valuesCallbackList);
  }, 1000);
}
const arrayFilterParams: ISetFilterParams = {
  values: valuesArray,
};
const callbackFilterParams: ISetFilterParams = {
  values: valuesCallback,
  refreshValuesOnOpen: true,
};
