import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
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
  RowClassParams,
  RowSelectionModule,
  RowSelectionOptions,
  RowStyleModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { createNewRowData, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <div>
        <button class="bt-action" (click)="onAddRow('For Sale')">
          Add For Sale
        </button>
        <button class="bt-action" (click)="onAddRow('In Workshop')">
          Add In Workshop
        </button>
        <button class="bt-action" (click)="onRemoveSelected()">
          Remove Selected
        </button>
        <button class="bt-action" (click)="getRowData()">Get Row Data</button>
      </div>
      <div style="margin-top: 5px">
        <button class="bt-action" (click)="onMoveToGroup('For Sale')">
          Move to For Sale
        </button>
        <button class="bt-action" (click)="onMoveToGroup('In Workshop')">
          Move to In Workshop
        </button>
        <button class="bt-action" (click)="onMoveToGroup('Sold')">
          Move to Sold
        </button>
      </div>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [rowData]="rowData"
      [rowSelection]="rowSelection"
      [suppressAggFuncInHeader]="true"
      [getRowClass]="getRowClass"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "category", rowGroupIndex: 1, hide: true },
    { field: "price", aggFunc: "sum", valueFormatter: poundFormatter },
    { field: "zombies" },
    { field: "style" },
    { field: "clothes" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    width: 100,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "Group",
    minWidth: 250,
    field: "model",
    rowGroupIndex: 1,
    cellRenderer: "agGroupCellRenderer",
  };
  groupDefaultExpanded = 1;
  rowData: any[] | null = getData();
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    groupSelects: "descendants",
    headerCheckbox: false,
    checkboxLocation: "autoGroupColumn",
  };
  getRowClass: (params: RowClassParams) => string | string[] | undefined = (
    params: RowClassParams,
  ) => {
    const rowNode = params.node;
    if (rowNode.group) {
      switch (rowNode.key) {
        case "In Workshop":
          return "category-in-workshop";
        case "Sold":
          return "category-sold";
        case "For Sale":
          return "category-for-sale";
        default:
          return undefined;
      }
    } else {
      // no extra classes for leaf rows
      return undefined;
    }
  };

  getRowData() {
    const rowData: any[] = [];
    this.gridApi.forEachNode(function (node) {
      rowData.push(node.data);
    });
    console.log("Row Data:");
    console.log(rowData);
  }

  onAddRow(category: string) {
    const rowDataItem = createNewRowData(category);
    this.gridApi.applyTransaction({ add: [rowDataItem] });
  }

  onMoveToGroup(category: string) {
    const selectedRowData = this.gridApi.getSelectedRows();
    selectedRowData.forEach((dataItem) => {
      dataItem.category = category;
    });
    this.gridApi.applyTransaction({ update: selectedRowData });
  }

  onRemoveSelected() {
    const selectedRowData = this.gridApi.getSelectedRows();
    this.gridApi.applyTransaction({ remove: selectedRowData });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function poundFormatter(params: ValueFormatterParams) {
  return (
    "£" +
    Math.floor(params.value)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}
