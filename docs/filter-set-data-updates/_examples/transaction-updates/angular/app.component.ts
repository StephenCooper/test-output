import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  SideBarDef,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <label>Transaction Updates: </label>
      <button (click)="updateFirstRow()">Update First Displayed Row</button>
      <button (click)="addDRow()">Add New 'D' Row</button>
      <button (click)="reset()" style="margin-left: 20px">Reset</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [sideBar]="sideBar"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  rowData: any[] | null = getRowData();
  columnDefs: ColDef[] = [
    {
      headerName: "Set Filter Column",
      field: "col1",
      filter: "agSetColumnFilter",
      editable: true,
      minWidth: 250,
    },
  ];
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }

  updateFirstRow() {
    const firstRow = this.gridApi.getDisplayedRowAtIndex(0);
    if (firstRow) {
      const firstRowData = firstRow.data;
      firstRowData["col1"] += "X";
      this.gridApi.applyTransaction({ update: [firstRowData] });
    }
  }

  addDRow() {
    this.gridApi.applyTransaction({ add: [{ col1: "D" }] });
  }

  reset() {
    this.gridApi.setFilterModel(null);
    this.gridApi.setGridOption("rowData", getRowData());
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function getRowData() {
  return [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "B" },
    { col1: "C" },
    { col1: "C" },
  ];
}
