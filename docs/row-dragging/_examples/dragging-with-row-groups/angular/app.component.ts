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
  NumberFilterModule,
  RowDragCallbackParams,
  RowDragEndEvent,
  RowDragModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
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
    [groupDefaultExpanded]="groupDefaultExpanded"
    [rowData]="rowData"
    (rowDragMove)="onRowDragMove($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "athlete", rowDrag: rowDrag },
    { field: "country", rowGroup: true },
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
  groupDefaultExpanded = 1;
  rowData!: any[];

  onRowDragMove(event: RowDragEndEvent) {
    const movingNode = event.node!;
    const overNode = event.overNode!;
    // find out what country group we are hovering over
    let groupCountry;
    if (overNode.group) {
      // if over a group, we take the group key (which will be the
      // country as we are grouping by country)
      groupCountry = overNode.key;
    } else {
      // if over a non-group, we take the country directly
      groupCountry = overNode.data.country;
    }
    const needToChangeParent = movingNode.data.country !== groupCountry;
    if (needToChangeParent) {
      const movingData = movingNode.data;
      movingData.country = groupCountry;
      this.gridApi.applyTransaction({
        update: [movingData],
      });
      this.gridApi.clearFocusedCell();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    params.api.setGridOption("rowData", getData());
  }
}

const rowDrag = function (params: RowDragCallbackParams) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
};
