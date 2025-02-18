import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  NumberEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <button (click)="setPriceOnToyota()">Set Price on Toyota</button>
      <button (click)="setDataOnFord()">Set Data on Ford</button>
      <button (click)="updateDataOnFord()">Update Data on Ford</button>
      <button (click)="updateSort()" style="margin-left: 15px">Sort</button>
      <button (click)="updateFilter()">Filter</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  rowData: any[] | null = [
    { id: "aa", make: "Toyota", model: "Celica", price: 35000 },
    { id: "bb", make: "Ford", model: "Mondeo", price: 32000 },
    { id: "cc", make: "Porsche", model: "Boxster", price: 72000 },
    { id: "dd", make: "BMW", model: "5 Series", price: 59000 },
    { id: "ee", make: "Dodge", model: "Challanger", price: 35000 },
    { id: "ff", make: "Mazda", model: "MX5", price: 28000 },
    { id: "gg", make: "Horse", model: "Outside", price: 99000 },
  ];
  columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    filter: true,
    enableCellChangeFlash: true,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };

  updateSort() {
    this.gridApi.refreshClientSideRowModel("sort");
  }

  updateFilter() {
    this.gridApi.refreshClientSideRowModel("filter");
  }

  setPriceOnToyota() {
    const rowNode = this.gridApi.getRowNode("aa")!;
    const newPrice = Math.floor(Math.random() * 100000);
    rowNode.setDataValue("price", newPrice);
  }

  setDataOnFord() {
    const rowNode = this.gridApi.getRowNode("bb")!;
    const newData = generateNewFordData();
    rowNode.setData(newData);
  }

  updateDataOnFord() {
    const rowNode = this.gridApi.getRowNode("bb")!;
    const newData = generateNewFordData();
    rowNode.updateData(newData);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function generateNewFordData() {
  const newPrice = Math.floor(Math.random() * 100000);
  const newModel = "T-" + Math.floor(Math.random() * 1000);
  return {
    id: "bb",
    make: "Ford",
    model: newModel,
    price: newPrice,
  };
}
