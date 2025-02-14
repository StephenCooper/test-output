import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IAggFunc,
  IRowNode,
  ModuleRegistry,
  NumberFilterModule,
  TextEditorModule,
  ValidationModule,
  ValueParserParams,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  SetFilterModule,
  HighlightChangesModule,
  NumberFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="parent-container">
    <div class="top-container">
      <button (click)="updateOneRecord()">Update One Value</button>
      <button (click)="updateUsingTransaction()">
        Update Using Transaction
      </button>
      <button (click)="removeUsingTransaction()">
        Remove Using Transaction
      </button>
      <button (click)="addUsingTransaction()">Add Using Transaction</button>
      <button (click)="changeGroupUsingTransaction()">
        Change Group Using Transaction
      </button>
    </div>
    <div class="center-container">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [autoGroupColumnDef]="autoGroupColumnDef"
        [columnTypes]="columnTypes"
        [aggregateOnlyChangedColumns]="true"
        [aggFuncs]="aggFuncs"
        [groupDefaultExpanded]="groupDefaultExpanded"
        [suppressAggFuncInHeader]="true"
        [getRowId]="getRowId"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "topGroup", rowGroup: true, hide: true },
    { field: "group", rowGroup: true, hide: true },
    { headerName: "ID", field: "id", cellClass: "number-cell", maxWidth: 70 },
    { field: "a", type: "valueColumn" },
    { field: "b", type: "valueColumn" },
    { field: "c", type: "valueColumn" },
    { field: "d", type: "valueColumn" },
    {
      headerName: "Total",
      type: "totalColumn",
      minWidth: 120,
      // we use getValue() instead of data.a so that it gets the aggregated values at the group level
      valueGetter:
        'getValue("a") + getValue("b") + getValue("c") + getValue("d")',
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 180,
  };
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    valueColumn: {
      minWidth: 90,
      editable: true,
      aggFunc: "sum",
      cellClass: "number-cell",
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
      valueParser: numberValueParser,
    },
    totalColumn: {
      cellRenderer: "agAnimateShowChangeCellRenderer",
      cellClass: "number-cell",
    },
  };
  aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    sum: (params) => {
      const values = params && params.values ? params.values : [];
      let result = 0;
      if (values) {
        values.forEach((value) => {
          if (typeof value === "number") {
            result += value;
          }
        });
      }
      callCount++;
      console.log(
        callCount + " aggregation: sum([" + values.join(",") + "]) = " + result,
      );
      return result;
    },
  };
  groupDefaultExpanded = 1;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => String(params.data.id);
  rowData!: any[];

  updateOneRecord() {
    const rowNodeToUpdate = pickExistingRowNodeAtRandom(this.gridApi);
    if (!rowNodeToUpdate) return;
    const randomValue = createRandomNumber();
    const randomColumnId = pickRandomColumn();
    console.log(
      "updating " + randomColumnId + " to " + randomValue + " on ",
      rowNodeToUpdate.data,
    );
    rowNodeToUpdate.setDataValue(randomColumnId, randomValue);
  }

  updateUsingTransaction() {
    const itemToUpdate = pickExistingRowItemAtRandom(this.gridApi);
    if (!itemToUpdate) {
      return;
    }
    console.log("updating - before", itemToUpdate);
    itemToUpdate[pickRandomColumn()] = createRandomNumber();
    itemToUpdate[pickRandomColumn()] = createRandomNumber();
    const transaction = {
      update: [itemToUpdate],
    };
    console.log("updating - after", itemToUpdate);
    this.gridApi.applyTransaction(transaction);
  }

  removeUsingTransaction() {
    const itemToRemove = pickExistingRowItemAtRandom(this.gridApi);
    if (!itemToRemove) {
      return;
    }
    const transaction = {
      remove: [itemToRemove],
    };
    console.log("removing", itemToRemove);
    this.gridApi.applyTransaction(transaction);
  }

  addUsingTransaction() {
    const i = Math.floor(Math.random() * 2);
    const j = Math.floor(Math.random() * 5);
    const k = Math.floor(Math.random() * 3);
    const newItem = createRowItem(i, j, k);
    const transaction = {
      add: [newItem],
    };
    console.log("adding", newItem);
    this.gridApi.applyTransaction(transaction);
  }

  changeGroupUsingTransaction() {
    const itemToUpdate = pickExistingRowItemAtRandom(this.gridApi);
    if (!itemToUpdate) {
      return;
    }
    itemToUpdate.topGroup = itemToUpdate.topGroup === "Top" ? "Bottom" : "Top";
    const transaction = {
      update: [itemToUpdate],
    };
    console.log("updating", itemToUpdate);
    this.gridApi.applyTransaction(transaction);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    params.api.setGridOption("rowData", createRowData());
  }
}

let rowIdCounter = 0;
let callCount = 0;
function createRowData() {
  const result = [];
  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 5; j++) {
      for (let k = 1; k <= 3; k++) {
        const rowDataItem = createRowItem(i, j, k);
        result.push(rowDataItem);
      }
    }
  }
  return result;
}
function createRowItem(i: number, j: number, k: number) {
  const rowDataItem = {
    id: rowIdCounter++,
    a: (j * k * 863) % 100,
    b: (j * k * 811) % 100,
    c: (j * k * 743) % 100,
    d: (j * k * 677) % 100,
    topGroup: "Bottom",
    group: "Group B" + j,
  };
  if (i === 1) {
    rowDataItem.topGroup = "Top";
    rowDataItem.group = "Group A" + j;
  }
  return rowDataItem;
}
// converts strings to numbers
function numberValueParser(params: ValueParserParams) {
  console.log("=> updating to " + params.newValue);
  return Number(params.newValue);
}
function pickRandomColumn() {
  const letters = ["a", "b", "c", "d"];
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}
function createRandomNumber() {
  return Math.floor(Math.random() * 100);
}
function pickExistingRowItemAtRandom(api: GridApi) {
  const rowNode = pickExistingRowNodeAtRandom(api);
  return rowNode ? rowNode.data : null;
}
function pickExistingRowNodeAtRandom(api: GridApi): IRowNode | undefined {
  const allItems: IRowNode[] = [];
  api.forEachLeafNode(function (rowNode) {
    allItems.push(rowNode);
  });
  if (allItems.length === 0) {
    return undefined;
  }
  const result = allItems[Math.floor(Math.random() * allItems.length)];
  return result;
}
