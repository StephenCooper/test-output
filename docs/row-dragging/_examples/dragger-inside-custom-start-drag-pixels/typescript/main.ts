import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  RowDragCancelEvent,
  RowDragEndEvent,
  RowDragEnterEvent,
  RowDragModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CustomCellRenderer } from "./customCellRenderer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowDragModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    field: "athlete",
    cellClass: "custom-athlete-cell",
    cellRenderer: CustomCellRenderer,
  },
  { field: "country" },
  { field: "year", width: 100 },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    width: 170,
    filter: true,
  },
  rowDragManaged: true,
  columnDefs: columnDefs,
  onRowDragEnter: onRowDragEnter,
  onRowDragEnd: onRowDragEnd,
  onRowDragCancel: onRowDragCancel,
};

function onRowDragEnter(e: RowDragEnterEvent) {
  console.log("onRowDragEnter", e);
}

function onRowDragEnd(e: RowDragEndEvent) {
  console.log("onRowDragEnd", e);
}

function onRowDragCancel(e: RowDragCancelEvent) {
  console.log("onRowDragCancel", e);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
