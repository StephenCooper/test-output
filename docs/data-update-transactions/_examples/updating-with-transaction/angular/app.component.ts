import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  RowNodeTransaction,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="height: 100%; display: flex; flex-direction: column">
    <div style="margin-bottom: 4px">
      <button (click)="addItems(undefined)">Add Items</button>
      <button (click)="addItems(2)">Add Items addIndex=2</button>
      <button (click)="updateItems()">Update Top 2</button>
      <button (click)="onRemoveSelected()">Remove Selected</button>
      <button (click)="getRowData()">Get Row Data</button>
      <button (click)="clearData()">Clear Data</button>
    </div>
    <div style="flex-grow: 1">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowData]="rowData"
        [rowSelection]="rowSelection"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "zombies" },
    { field: "style" },
    { field: "clothes" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  rowData: any[] | null = getData();
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };

  getRowData() {
    const rowData: any[] = [];
    this.gridApi.forEachNode(function (node) {
      rowData.push(node.data);
    });
    console.log("Row Data:");
    console.table(rowData);
  }

  clearData() {
    const rowData: any[] = [];
    this.gridApi.forEachNode(function (node) {
      rowData.push(node.data);
    });
    const res = this.gridApi.applyTransaction({
      remove: rowData,
    })!;
    printResult(res);
  }

  addItems(addIndex: number | undefined) {
    const newItems = [
      createNewRowData(),
      createNewRowData(),
      createNewRowData(),
    ];
    const res = this.gridApi.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    })!;
    printResult(res);
  }

  updateItems() {
    // update the first 2 items
    const itemsToUpdate: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
      // only do first 2
      if (index >= 2) {
        return;
      }
      const data = rowNode.data;
      data.price = Math.floor(Math.random() * 20000 + 20000);
      itemsToUpdate.push(data);
    });
    const res = this.gridApi.applyTransaction({ update: itemsToUpdate })!;
    printResult(res);
  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;
    printResult(res);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

let newCount = 1;
function createNewRowData() {
  const newData = {
    make: "Toyota " + newCount,
    model: "Celica " + newCount,
    price: 35000 + newCount * 17,
    zombies: "Headless",
    style: "Little",
    clothes: "Airbag",
  };
  newCount++;
  return newData;
}
function printResult(res: RowNodeTransaction) {
  console.log("---------------------------------------");
  if (res.add) {
    res.add.forEach((rowNode) => {
      console.log("Added Row Node", rowNode);
    });
  }
  if (res.remove) {
    res.remove.forEach((rowNode) => {
      console.log("Removed Row Node", rowNode);
    });
  }
  if (res.update) {
    res.update.forEach((rowNode) => {
      console.log("Updated Row Node", rowNode);
    });
  }
}
