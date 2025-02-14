import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  RowDragMoveEvent,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [getRowId]="getRowId"
    [rowData]="rowData"
    (sortChanged)="onSortChanged($event)"
    (filterChanged)="onFilterChanged($event)"
    (rowDragMove)="onRowDragMove($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "athlete", rowDrag: true },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    width: 170,
    filter: true,
  };
  rowData!: any[];

  // listen for change on sort changed
  onSortChanged() {
    const colState = this.gridApi.getColumnState() || [];
    sortActive = colState.some((c) => c.sort);
    // suppress row drag if either sort or filter is active
    const suppressRowDrag = sortActive || filterActive;
    console.log(
      "sortActive = " +
        sortActive +
        ", filterActive = " +
        filterActive +
        ", allowRowDrag = " +
        suppressRowDrag,
    );
    this.gridApi.setGridOption("suppressRowDrag", suppressRowDrag);
  }

  // listen for changes on filter changed
  onFilterChanged() {
    filterActive = this.gridApi.isAnyFilterPresent();
    // suppress row drag if either sort or filter is active
    const suppressRowDrag = sortActive || filterActive;
    console.log(
      "sortActive = " +
        sortActive +
        ", filterActive = " +
        filterActive +
        ", allowRowDrag = " +
        suppressRowDrag,
    );
    this.gridApi.setGridOption("suppressRowDrag", suppressRowDrag);
  }

  onRowDragMove(event: RowDragMoveEvent) {
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode !== overNode;
    if (rowNeedsToMove) {
      // the list of rows we have is data, not row nodes, so extract the data
      const movingData = movingNode.data;
      const overData = overNode!.data;
      const fromIndex = immutableStore.indexOf(movingData);
      const toIndex = immutableStore.indexOf(overData);
      const newStore = immutableStore.slice();
      moveInArray(newStore, fromIndex, toIndex);
      immutableStore = newStore;
      this.gridApi.setGridOption("rowData", newStore);
      this.gridApi.clearFocusedCell();
    }
    function moveInArray(arr: any[], fromIndex: number, toIndex: number) {
      const element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    // add id to each item, needed for immutable store to work
    immutableStore.forEach(function (data, index) {
      data.id = index;
    });
    params.api.setGridOption("rowData", immutableStore);
  }

  getRowId = (params: GetRowIdParams) => {
    return String(params.data.id);
  };
}

let immutableStore: any[] = getData();
let sortActive = false;
let filterActive = false;
