import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowGroupingDisplayType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;
const columnDefs: ColDef[] = [
  { field: "group", rowGroup: true, hide: true },
  { field: "id", pinned: "left", width: 70 },
  { field: "model", width: 180 },
  { field: "color", width: 100 },
  {
    field: "price",
    valueFormatter: "'$' + value.toLocaleString()",
    width: 100,
  },
  { field: "year", width: 100 },
  { field: "country", width: 120 },
];

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData: getData(),
  groupDisplayType: "groupRows",
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.expandAll();
}

function onBtPrint() {
  setPrinterFriendly(gridApi);

  setTimeout(() => {
    print();
    setNormal(gridApi);
  }, 2000);
}

function setPrinterFriendly(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
  eGridDiv.style.width = "";
  eGridDiv.style.height = "";
  api.setGridOption("domLayout", "print");
}

function setNormal(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
  eGridDiv.style.width = "700px";
  eGridDiv.style.height = "200px";

  api.setGridOption("domLayout", undefined);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtPrint = onBtPrint;
}
