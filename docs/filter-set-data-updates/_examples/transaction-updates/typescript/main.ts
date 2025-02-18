import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  SideBarDef,
  TextEditorModule,
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
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  rowData: getRowData(),
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
  onFirstDataRendered: onFirstDataRendered,
};

function getRowData() {
  return [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "B" },
    { col1: "C" },
    { col1: "C" },
  ];
}

function updateFirstRow() {
  const firstRow = gridApi!.getDisplayedRowAtIndex(0);
  if (firstRow) {
    const firstRowData = firstRow.data;
    firstRowData["col1"] += "X";
    gridApi!.applyTransaction({ update: [firstRowData] });
  }
}

function addDRow() {
  gridApi!.applyTransaction({ add: [{ col1: "D" }] });
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
  (<any>window).updateFirstRow = updateFirstRow;
  (<any>window).addDRow = addDRow;
  (<any>window).reset = reset;
}
