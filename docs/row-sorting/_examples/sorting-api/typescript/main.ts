import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete" },
  { field: "age", width: 90 },
  { field: "country" },
  { field: "year", width: 90 },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
};

function sortByAthleteAsc() {
  gridApi!.applyColumnState({
    state: [{ colId: "athlete", sort: "asc" }],
    defaultState: { sort: null },
  });
}

function sortByAthleteDesc() {
  gridApi!.applyColumnState({
    state: [{ colId: "athlete", sort: "desc" }],
    defaultState: { sort: null },
  });
}

function sortByCountryThenSport() {
  gridApi!.applyColumnState({
    state: [
      { colId: "country", sort: "asc", sortIndex: 0 },
      { colId: "sport", sort: "asc", sortIndex: 1 },
    ],
    defaultState: { sort: null },
  });
}

function sortBySportThenCountry() {
  gridApi!.applyColumnState({
    state: [
      { colId: "country", sort: "asc", sortIndex: 1 },
      { colId: "sport", sort: "asc", sortIndex: 0 },
    ],
    defaultState: { sort: null },
  });
}

function clearSort() {
  gridApi!.applyColumnState({
    defaultState: { sort: null },
  });
}

let savedSort: any;

function saveSort() {
  const colState = gridApi!.getColumnState();
  const sortState = colState
    .filter(function (s) {
      return s.sort != null;
    })
    .map(function (s) {
      return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
    });
  savedSort = sortState;
  console.log("saved sort", sortState);
}

function restoreFromSave() {
  gridApi!.applyColumnState({
    state: savedSort,
    defaultState: { sort: null },
  });
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).sortByAthleteAsc = sortByAthleteAsc;
  (<any>window).sortByAthleteDesc = sortByAthleteDesc;
  (<any>window).sortByCountryThenSport = sortByCountryThenSport;
  (<any>window).sortBySportThenCountry = sortBySportThenCountry;
  (<any>window).clearSort = clearSort;
  (<any>window).saveSort = saveSort;
  (<any>window).restoreFromSave = restoreFromSave;
}
