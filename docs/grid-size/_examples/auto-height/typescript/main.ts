import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DomLayoutType,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  TextFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColGroupDef[] = [
  {
    headerName: "Core",
    children: [
      { headerName: "ID", field: "id" },
      { field: "make" },
      { field: "price", filter: "agNumberColumnFilter" },
    ],
  },
  {
    headerName: "Extra",
    children: [
      { field: "val1", filter: "agNumberColumnFilter" },
      { field: "val2", filter: "agNumberColumnFilter" },
      { field: "val3", filter: "agNumberColumnFilter" },
      { field: "val4", filter: "agNumberColumnFilter" },
      { field: "val5", filter: "agNumberColumnFilter" },
      { field: "val6", filter: "agNumberColumnFilter" },
      { field: "val7", filter: "agNumberColumnFilter" },
      { field: "val8", filter: "agNumberColumnFilter" },
      { field: "val9", filter: "agNumberColumnFilter" },
      { field: "val10", filter: "agNumberColumnFilter" },
    ],
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    enableRowGroup: true,
    enableValue: true,
    filter: true,
  },
  rowData: getData(5),
  domLayout: "autoHeight",
  onGridReady: (params) => {
    document.querySelector("#currentRowCount")!.textContent = "5";
  },
  popupParent: document.body,
};

function createRow(index: number) {
  const makes = ["Toyota", "Ford", "BMW", "Phantom", "Porsche"];

  return {
    id: "D" + (1000 + index),
    make: makes[Math.floor(Math.random() * makes.length)],
    price: Math.floor(Math.random() * 100000),
    val1: Math.floor(Math.random() * 1000),
    val2: Math.floor(Math.random() * 1000),
    val3: Math.floor(Math.random() * 1000),
    val4: Math.floor(Math.random() * 1000),
    val5: Math.floor(Math.random() * 1000),
    val6: Math.floor(Math.random() * 1000),
    val7: Math.floor(Math.random() * 1000),
    val8: Math.floor(Math.random() * 1000),
    val9: Math.floor(Math.random() * 1000),
    val10: Math.floor(Math.random() * 1000),
  };
}

function getData(count: number) {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    rowData.push(createRow(i));
  }
  return rowData;
}

function updateRowData(rowCount: number) {
  gridApi!.setGridOption("rowData", getData(rowCount));

  document.querySelector("#currentRowCount")!.textContent = `${rowCount}`;
}

function cbFloatingRows() {
  const show = (document.getElementById("floating-rows") as HTMLInputElement)
    .checked;
  if (show) {
    gridApi!.setGridOption("pinnedTopRowData", [
      createRow(999),
      createRow(998),
    ]);
    gridApi!.setGridOption("pinnedBottomRowData", [
      createRow(997),
      createRow(996),
    ]);
  } else {
    gridApi!.setGridOption("pinnedTopRowData", undefined);
    gridApi!.setGridOption("pinnedBottomRowData", undefined);
  }
}

function setAutoHeight() {
  gridApi!.setGridOption("domLayout", "autoHeight");
  // auto height will get the grid to fill the height of the contents,
  // so the grid div should have no height set, the height is dynamic.
  (document.querySelector<HTMLElement>("#myGrid")! as any).style.height = "";
}

function setFixedHeight() {
  // we could also call setDomLayout() here as normal is the default
  gridApi!.setGridOption("domLayout", "normal");
  // when auto height is off, the grid ahs a fixed height, and then the grid
  // will provide scrollbars if the data does not fit into it.
  (document.querySelector<HTMLElement>("#myGrid")! as any)!.style.height =
    "400px";
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).updateRowData = updateRowData;
  (<any>window).cbFloatingRows = cbFloatingRows;
  (<any>window).setAutoHeight = setAutoHeight;
  (<any>window).setFixedHeight = setFixedHeight;
}
