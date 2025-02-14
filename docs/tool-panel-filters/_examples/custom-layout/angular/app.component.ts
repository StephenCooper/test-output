import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
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
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div>
      <span class="button-group">
        <button (click)="setCustomSortLayout()">Custom Sort Layout</button>
        <button (click)="setCustomGroupLayout()">Custom Group Layout</button>
      </span>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Athlete",
      children: [
        {
          headerName: "Name",
          field: "athlete",
          minWidth: 200,
          filter: "agTextColumnFilter",
        },
        { field: "age" },
        { field: "country", minWidth: 200 },
      ],
    },
    {
      headerName: "Competition",
      children: [{ field: "year" }, { field: "date", minWidth: 180 }],
    },
    { colId: "sport", field: "sport", minWidth: 200 },
    {
      headerName: "Medals",
      children: [
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ];
  defaultColDef: ColDef = {
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
        toolPanelParams: {
          suppressExpandAll: false,
          suppressFilterSearch: false,
          // prevents custom layout changing when columns are reordered in the grid
          suppressSyncLayoutWithGrid: true,
        },
      },
    ],
    defaultToolPanel: "filters",
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  setCustomSortLayout() {
    const filtersToolPanel = this.gridApi.getToolPanelInstance("filters");
    filtersToolPanel!.setFilterLayout(sortedToolPanelColumnDefs);
  }

  setCustomGroupLayout() {
    const filtersToolPanel = this.gridApi.getToolPanelInstance("filters");
    filtersToolPanel!.setFilterLayout(customToolPanelColumnDefs);
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

const sortedToolPanelColumnDefs = [
  {
    headerName: "Athlete",
    children: [
      { field: "age" },
      { field: "country" },
      { headerName: "Name", field: "athlete" },
    ],
  },
  {
    headerName: "Competition",
    children: [{ field: "date" }, { field: "year" }],
  },
  {
    headerName: "Medals",
    children: [
      { field: "bronze" },
      { field: "gold" },
      { field: "silver" },
      { field: "total" },
    ],
  },
  { colId: "sport", field: "sport", width: 110 },
];
const customToolPanelColumnDefs = [
  {
    headerName: "Dummy Group 1",
    children: [
      { field: "age" },
      { headerName: "Name", field: "athlete" },
      {
        headerName: "Dummy Group 2",
        children: [{ colId: "sport" }, { field: "country" }],
      },
    ],
  },
  {
    headerName: "Medals",
    children: [
      { field: "total" },
      { field: "bronze" },
      {
        headerName: "Dummy Group 3",
        children: [{ field: "silver" }, { field: "gold" }],
      },
    ],
  },
];
