import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  IRowNode,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <button (click)="onBtForEachNode()">For-Each Node</button>
      <button (click)="onBtForEachNodeAfterFilter()">
        For-Each Node After Filter
      </button>
      <button (click)="onBtForEachNodeAfterFilterAndSort()">
        For-Each Node After Filter and Sort
      </button>
      <button (click)="onBtForEachLeafNode()">For-Each Leaf Node</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  groupDefaultExpanded = 1;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtForEachNode() {
    console.log("### api.forEachNode() ###");
    this.gridApi.forEachNode(printNode);
  }

  onBtForEachNodeAfterFilter() {
    console.log("### api.forEachNodeAfterFilter() ###");
    this.gridApi.forEachNodeAfterFilter(printNode);
  }

  onBtForEachNodeAfterFilterAndSort() {
    console.log("### api.forEachNodeAfterFilterAndSort() ###");
    this.gridApi.forEachNodeAfterFilterAndSort(printNode);
  }

  onBtForEachLeafNode() {
    console.log("### api.forEachLeafNode() ###");
    this.gridApi.forEachLeafNode(printNode);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data.slice(0, 50)));
  }
}

const printNode = (node: IRowNode<IOlympicData>, index?: number) => {
  if (node.group) {
    console.log(index + " -> group: " + node.key);
  } else {
    console.log(
      index + " -> data: " + node.data!.country + ", " + node.data!.athlete,
    );
  }
};
