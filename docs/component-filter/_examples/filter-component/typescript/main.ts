import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
import { PartialMatchFilter } from "./partialMatchFilter";

ModuleRegistry.registerModules([
  TextFilterModule,
  TextEditorModule,
  CustomFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "row" },
  {
    field: "name",
    filter: PartialMatchFilter,
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  columnDefs: columnDefs,
  rowData: getData(),
};

function onClicked() {
  gridApi!
    .getColumnFilterInstance<PartialMatchFilter>("name")
    .then((instance) => {
      instance!.componentMethod("Hello World!");
    });
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onClicked = onClicked;
}
