import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ToolPanelSizeChangedEvent,
  ToolPanelVisibleChangedEvent,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  PivotModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="parent-div">
    <div class="api-panel">
      <div class="api-column">
        Visibility
        <button (click)="setSideBarVisible(true)">
          setSideBarVisible(true)
        </button>
        <button (click)="setSideBarVisible(false)">
          setSideBarVisible(false)
        </button>
        <button (click)="isSideBarVisible()">isSideBarVisible()</button>
      </div>
      <div class="api-column">
        Open &amp; Close
        <button (click)="openToolPanel('columns')">
          openToolPanel('columns')
        </button>
        <button (click)="openToolPanel('filters')">
          openToolPanel('filters')
        </button>
        <button (click)="closeToolPanel()">closeToolPanel()</button>
        <button (click)="getOpenedToolPanel()">getOpenedToolPanel()</button>
      </div>
      <div class="api-column">
        Reset
        <button (click)="setSideBar(['filters', 'columns'])">
          setSideBar(['filters','columns'])
        </button>
        <button (click)="setSideBar('columns')">setSideBar('columns')</button>
        <button (click)="getSideBar()">getSideBar()</button>
      </div>
      <div class="api-column">
        Position
        <button (click)="setSideBarPosition('left')">
          setSideBarPosition('left')
        </button>
        <button (click)="setSideBarPosition('right')">
          setSideBarPosition('right')
        </button>
      </div>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="grid-div"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (toolPanelVisibleChanged)="onToolPanelVisibleChanged($event)"
      (toolPanelSizeChanged)="onToolPanelSizeChanged($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", filter: "agTextColumnFilter", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 160 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
      },
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
      },
    ],
    defaultToolPanel: "filters",
    hiddenByDefault: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onToolPanelVisibleChanged(event: ToolPanelVisibleChangedEvent) {
    console.log("toolPanelVisibleChanged", event);
  }

  onToolPanelSizeChanged(event: ToolPanelSizeChangedEvent) {
    console.log("toolPanelSizeChanged", event);
  }

  setSideBarVisible(value: boolean) {
    this.gridApi.setSideBarVisible(value);
  }

  isSideBarVisible() {
    alert(this.gridApi.isSideBarVisible());
  }

  openToolPanel(key: string) {
    this.gridApi.openToolPanel(key);
  }

  closeToolPanel() {
    this.gridApi.closeToolPanel();
  }

  getOpenedToolPanel() {
    alert(this.gridApi.getOpenedToolPanel());
  }

  setSideBar(def: SideBarDef | string | string[] | boolean) {
    this.gridApi.setGridOption("sideBar", def);
  }

  getSideBar() {
    const sideBar = this.gridApi.getSideBar();
    alert(JSON.stringify(sideBar));
    console.log(sideBar);
  }

  setSideBarPosition(position: "left" | "right") {
    this.gridApi.setSideBarPosition(position);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
