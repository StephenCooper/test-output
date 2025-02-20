import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ISetFilter,
  ISetFilterParams,
  ModuleRegistry,
  SetFilterValuesFuncParams,
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
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const list1 = ["Elephant", "Lion", "Monkey"];
const list2 = ["Elephant", "Giraffe", "Tiger"];

const valuesArray = list1.slice();
let valuesCallbackList = list1;

function valuesCallback(params: SetFilterValuesFuncParams) {
  setTimeout(() => {
    params.success(valuesCallbackList);
  }, 1000);
}

const arrayFilterParams: ISetFilterParams = {
  values: valuesArray,
};

const callbackFilterParams: ISetFilterParams = {
  values: valuesCallback,
  refreshValuesOnOpen: true,
};

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    {
      colId: "array",
      headerName: "Values Array",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: arrayFilterParams,
    },
    {
      colId: "callback",
      headerName: "Values Callback",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: callbackFilterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  sideBar: "filters",
  rowData: getData(),
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.getToolPanelInstance("filters")!.expandFilters();
}

function useList1() {
  console.log("Updating values to " + list1);
  valuesArray.length = 0;
  list1.forEach((value) => {
    valuesArray.push(value);
  });

  gridApi!.getColumnFilterInstance<ISetFilter>("array").then((filter) => {
    filter!.refreshFilterValues();

    valuesCallbackList = list1;
  });
}

function useList2() {
  console.log("Updating values to " + list2);
  valuesArray.length = 0;
  list2.forEach((value) => {
    valuesArray.push(value);
  });

  gridApi!.getColumnFilterInstance<ISetFilter>("array").then((filter) => {
    filter!.refreshFilterValues();

    valuesCallbackList = list2;
  })!;
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).useList1 = useList1;
  (<any>window).useList2 = useList2;
}
