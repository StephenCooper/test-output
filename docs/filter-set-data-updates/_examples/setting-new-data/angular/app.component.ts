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
  ModuleRegistry,
  SideBarDef,
  TextEditorModule,
  TextFilterModule,
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
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="updateOne()">Apply Data Update 1</button>
      <button (click)="updateTwo()">Apply Data Update 2</button>
      <button (click)="reset()" style="margin-left: 5px">Reset</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
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
      headerName: "Set Filter Column",
      field: "col1",
      filter: "agSetColumnFilter",
      editable: true,
      minWidth: 250,
    },
  ];
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData: any[] | null = getRowData();

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }

  updateOne() {
    const newData = [
      { col1: "A" },
      { col1: "A" },
      { col1: "C" },
      { col1: "D" },
      { col1: "E" },
    ];
    this.gridApi.setGridOption("rowData", newData);
  }

  updateTwo() {
    const newData = [
      { col1: "A" },
      { col1: "A" },
      { col1: "B" },
      { col1: "C" },
      { col1: "D" },
      { col1: "E" },
      { col1: "B" },
      { col1: "B" },
    ];
    this.gridApi.setGridOption("rowData", newData);
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
  return [{ col1: "A" }, { col1: "A" }, { col1: "B" }, { col1: "C" }];
}
