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
        <button (click)="expandAthleteAndCompetition()">
          Expand Athlete &amp; Competition
        </button>
        <button (click)="collapseCompetition()">Collapse Competition</button>
        <button (click)="expandAll()">Expand All</button>
        <button (click)="collapseAll()">Collapse All</button>
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
      groupId: "athleteGroupId",
      headerName: "Athlete",
      children: [
        {
          headerName: "Name",
          field: "athlete",
          minWidth: 200,
          filter: "agTextColumnFilter",
        },
        { field: "age" },
        {
          groupId: "competitionGroupId",
          headerName: "Competition",
          children: [{ field: "year" }, { field: "date", minWidth: 180 }],
        },
        { field: "country", minWidth: 200 },
      ],
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
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  collapseAll() {
    this.gridApi.getToolPanelInstance("filters")!.collapseFilterGroups();
  }

  expandAthleteAndCompetition() {
    this.gridApi
      .getToolPanelInstance("filters")!
      .expandFilterGroups(["athleteGroupId", "competitionGroupId"]);
  }

  collapseCompetition() {
    this.gridApi
      .getToolPanelInstance("filters")!
      .collapseFilterGroups(["competitionGroupId"]);
  }

  expandAll() {
    this.gridApi.getToolPanelInstance("filters")!.expandFilterGroups();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    // initially collapse all filter groups
    params.api.getToolPanelInstance("filters")!.collapseFilterGroups();

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
