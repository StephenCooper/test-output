import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

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

const columnDefs: (ColDef | ColGroupDef)[] = [
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

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  sideBar: "filters",
  onGridReady: (params) => {
    // initially collapse all filter groups
    params.api.getToolPanelInstance("filters")!.collapseFilterGroups();
  },
};

function collapseAll() {
  gridApi!.getToolPanelInstance("filters")!.collapseFilterGroups();
}

function expandAthleteAndCompetition() {
  gridApi!
    .getToolPanelInstance("filters")!
    .expandFilterGroups(["athleteGroupId", "competitionGroupId"]);
}

function collapseCompetition() {
  gridApi!
    .getToolPanelInstance("filters")!
    .collapseFilterGroups(["competitionGroupId"]);
}

function expandAll() {
  gridApi!.getToolPanelInstance("filters")!.expandFilterGroups();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).collapseAll = collapseAll;
  (<any>window).expandAthleteAndCompetition = expandAthleteAndCompetition;
  (<any>window).collapseCompetition = collapseCompetition;
  (<any>window).expandAll = expandAll;
}
