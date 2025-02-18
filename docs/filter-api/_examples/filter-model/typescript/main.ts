import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }

    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }

    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

const columnDefs: ColDef[] = [
  { field: "athlete", filter: "agTextColumnFilter" },
  { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
  { field: "country" },
  { field: "year", maxWidth: 100 },
  {
    field: "date",
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  { field: "sport" },
  { field: "gold", filter: "agNumberColumnFilter" },
  { field: "silver", filter: "agNumberColumnFilter" },
  { field: "bronze", filter: "agNumberColumnFilter" },
  { field: "total", filter: "agNumberColumnFilter" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  sideBar: "filters",
  onGridReady: (params) => {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  },
};

let savedFilterModel: any = null;

function clearFilters() {
  gridApi!.setFilterModel(null);
}

function saveFilterModel() {
  savedFilterModel = gridApi!.getFilterModel();

  const keys = Object.keys(savedFilterModel);
  const savedFilters: string = keys.length > 0 ? keys.join(", ") : "(none)";

  (document.querySelector("#savedFilters") as any).textContent = savedFilters;
}

function restoreFilterModel() {
  gridApi!.setFilterModel(savedFilterModel);
}

function restoreFromHardCoded() {
  const hardcodedFilter = {
    country: {
      type: "set",
      values: ["Ireland", "United States"],
    },
    age: { type: "lessThan", filter: "30" },
    athlete: { type: "startsWith", filter: "Mich" },
    date: { type: "lessThan", dateFrom: "2010-01-01" },
  };

  gridApi!.setFilterModel(hardcodedFilter);
}

function destroyFilter() {
  gridApi!.destroyFilter("athlete");
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).clearFilters = clearFilters;
  (<any>window).saveFilterModel = saveFilterModel;
  (<any>window).restoreFilterModel = restoreFilterModel;
  (<any>window).restoreFromHardCoded = restoreFromHardCoded;
  (<any>window).destroyFilter = destroyFilter;
}
