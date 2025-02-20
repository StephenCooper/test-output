import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
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

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const listOfDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const daysValuesNotProvidedFilterParams: ISetFilterParams = {
  comparator: (a: string | null, b: string | null) => {
    const aIndex = a == null ? -1 : listOfDays.indexOf(a);
    const bIndex = b == null ? -1 : listOfDays.indexOf(b);
    if (aIndex === bIndex) return 0;
    return aIndex > bIndex ? 1 : -1;
  },
};

const daysValuesProvidedFilterParams: ISetFilterParams = {
  values: listOfDays,
  suppressSorting: true, // use provided order
};

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    {
      headerName: "Days (Values Not Provided)",
      field: "days",
      filter: "agSetColumnFilter",
      filterParams: daysValuesNotProvidedFilterParams,
    },
    {
      headerName: "Days (Values Provided)",
      field: "days",
      filter: "agSetColumnFilter",
      filterParams: daysValuesProvidedFilterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  sideBar: "filters",
  rowData: getRowData(),
  onFirstDataRendered: onFirstDataRendered,
};

function getRowData() {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const rows = [];
  for (let i = 0; i < 200; i++) {
    const index = Math.floor(Math.random() * 5);
    rows.push({ days: weekdays[index] });
  }

  return rows;
}

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.getToolPanelInstance("filters")!.expandFilters();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
