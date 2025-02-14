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
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
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
  template: `<div class="example-wrapper">
    <div>
      <span class="button-group">
        <button (click)="expandAllGroups()">Expand All</button>
        <button (click)="collapseAllGroups()">Collapse All</button>
        <button (click)="expandAthleteAndCompetitionGroups()">
          Expand Athlete &amp; Competition
        </button>
        <button (click)="collapseCompetitionGroups()">
          Collapse Competition
        </button>
      </span>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
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
        {
          groupId: "competitionGroupId",
          headerName: "Competition",
          children: [{ field: "year" }, { field: "date", minWidth: 180 }],
        },
      ],
    },
    {
      groupId: "medalsGroupId",
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
  sideBar: SideBarDef | string | string[] | boolean | null = "columns";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  expandAllGroups() {
    const columnToolPanel = this.gridApi.getToolPanelInstance("columns")!;
    columnToolPanel.expandColumnGroups();
  }

  collapseAllGroups() {
    const columnToolPanel = this.gridApi.getToolPanelInstance("columns")!;
    columnToolPanel.collapseColumnGroups();
  }

  expandAthleteAndCompetitionGroups() {
    const columnToolPanel = this.gridApi.getToolPanelInstance("columns")!;
    columnToolPanel.expandColumnGroups([
      "athleteGroupId",
      "competitionGroupId",
    ]);
  }

  collapseCompetitionGroups() {
    const columnToolPanel = this.gridApi.getToolPanelInstance("columns")!;
    columnToolPanel.collapseColumnGroups(["competitionGroupId"]);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    const columnToolPanel = params.api.getToolPanelInstance("columns")!;
    columnToolPanel.collapseColumnGroups();

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
