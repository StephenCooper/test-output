import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  TextEditorModule,
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

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    {
      headerName: "Set Filter Column",
      field: "col1",
      filter: "agSetColumnFilter",
      editable: true,
      minWidth: 250,
    },
  ],
  sideBar: "filters",
  rowData: getRowData(),
  onFirstDataRendered: onFirstDataRendered,
};

function getRowData() {
  return [{ col1: "A" }, { col1: "A" }, { col1: "B" }, { col1: "C" }];
}

function updateOne() {
  const newData = [
    { col1: "A" },
    { col1: "A" },
    { col1: "C" },
    { col1: "D" },
    { col1: "E" },
  ];
  gridApi!.setGridOption("rowData", newData);
}

function updateTwo() {
  const newData = [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "C" },
    { col1: "D" },
    { col1: "E" },
    { col1: "B" },
    { col1: "B" },
  ];
  gridApi!.setGridOption("rowData", newData);
}

function reset() {
  gridApi!.setFilterModel(null);
  gridApi!.setGridOption("rowData", getRowData());
}

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.getToolPanelInstance("filters")!.expandFilters();
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).updateOne = updateOne;
  (<any>window).updateTwo = updateTwo;
  (<any>window).reset = reset;
}
