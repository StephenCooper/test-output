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
  RowHeightParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div
      style="margin-bottom: 5px; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 13px"
    >
      <div>
        Top Level Groups:
        <button (click)="setGroupHeight(42)">42px</button>
        <button (click)="setGroupHeight(75)">75px</button>
        <button (click)="setGroupHeight(125)">125px</button>
      </div>
      <div style="margin-top: 5px">
        Swimming Leaf Rows:
        <button (click)="setSwimmingHeight(42)">42px</button>
        <button (click)="setSwimmingHeight(75)">75px</button>
        <button (click)="setSwimmingHeight(125)">125px</button>
      </div>
      <div style="margin-top: 5px">
        United States Leaf Rows:
        <button (click)="setUsaHeight(42)">42px</button>
        <button (click)="setUsaHeight(75)">75px</button>
        <button (click)="setUsaHeight(125)">125px</button>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [getRowHeight]="getRowHeight"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true },
    { field: "athlete" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  rowData: IOlympicData[] | null = getData();
  groupDefaultExpanded = 1;

  setSwimmingHeight(height: number) {
    swimmingHeight = height;
    this.gridApi.resetRowHeights();
  }

  setGroupHeight(height: number) {
    groupHeight = height;
    this.gridApi.resetRowHeights();
  }

  setUsaHeight(height: number) {
    // this is used next time resetRowHeights is called
    usaHeight = height;
    this.gridApi.forEachNode(function (rowNode) {
      if (rowNode.data && rowNode.data.country === "United States") {
        rowNode.setRowHeight(height);
      }
    });
    this.gridApi.onRowHeightChanged();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;
  }

  getRowHeight = (
    params: RowHeightParams<IOlympicData>,
  ): number | undefined | null => {
    if (params.node.group && groupHeight != null) {
      return groupHeight;
    } else if (
      params.data &&
      params.data.country === "United States" &&
      usaHeight != null
    ) {
      return usaHeight;
    } else if (
      params.data &&
      params.data.sport === "Swimming" &&
      swimmingHeight != null
    ) {
      return swimmingHeight;
    }
  };
}

let swimmingHeight: number;
let groupHeight: number;
let usaHeight: number;
