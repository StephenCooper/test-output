import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ISetFilter,
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
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
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      field: "athlete",
      filter: "agSetColumnFilter",
    },
    {
      field: "country",
      valueFormatter: (params: ValueFormatterParams) => {
        return `${params.value.name} (${params.value.code})`;
      },
      keyCreator: countryKeyCreator,
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => params.value.name,
      } as ISetFilterParams,
    },
    { field: "age", maxWidth: 120, filter: "agNumberColumnFilter" },
    { field: "year", maxWidth: 120 },
    { field: "date" },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 160,
    filter: true,
  },
  sideBar: "filters",
  onFirstDataRendered: onFirstDataRendered,
};

function countryKeyCreator(params: KeyCreatorParams) {
  return params.value.name;
}

function patchData(data: any[]) {
  // hack the data, replace each country with an object of country name and code
  data.forEach((row) => {
    const countryName = row.country;
    const countryCode = countryName.substring(0, 2).toUpperCase();
    row.country = {
      name: countryName,
      code: countryCode,
    };
  });
}

function selectJohnAndKenny() {
  gridApi!
    .setColumnFilterModel("athlete", {
      values: ["John Joe Nevin", "Kenny Egan"],
    })
    .then(() => {
      gridApi!.onFilterChanged();
    });
}

function selectEverything() {
  gridApi!.setColumnFilterModel("athlete", null).then(() => {
    gridApi!.onFilterChanged();
  });
}

function selectNothing() {
  gridApi!.setColumnFilterModel("athlete", { values: [] }).then(() => {
    gridApi!.onFilterChanged();
  });
}

function setCountriesToFranceAustralia() {
  gridApi!
    .getColumnFilterInstance<
      ISetFilter<{ name: string; code: string }>
    >("country")
    .then((instance) => {
      instance!.setFilterValues([
        {
          name: "France",
          code: "FR",
        },
        {
          name: "Australia",
          code: "AU",
        },
      ]);
      instance!.applyModel();
      gridApi!.onFilterChanged();
    });
}

function setCountriesToAll() {
  gridApi!
    .getColumnFilterInstance<
      ISetFilter<{ name: string; code: string }>
    >("country")
    .then((instance) => {
      instance!.resetFilterValues();
      instance!.applyModel();
      gridApi!.onFilterChanged();
    });
}

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.getToolPanelInstance("filters")!.expandFilters();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    patchData(data);
    gridApi!.setGridOption("rowData", data);
  });

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).selectJohnAndKenny = selectJohnAndKenny;
  (<any>window).selectEverything = selectEverything;
  (<any>window).selectNothing = selectNothing;
  (<any>window).setCountriesToFranceAustralia = setCountriesToFranceAustralia;
  (<any>window).setCountriesToAll = setCountriesToAll;
}
