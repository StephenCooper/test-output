import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  ColumnAutoSizeModule,
  ColumnResizedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", width: 150, suppressSizeToFit: true },
  {
    field: "age",
    headerName: "Age of Athlete",
    width: 90,
    minWidth: 50,
    maxWidth: 150,
  },
  { field: "country", width: 120 },
  { field: "year", width: 90 },
  { field: "date", width: 110 },
  { field: "sport", width: 110 },
  { field: "gold", width: 100 },
  { field: "silver", width: 100 },
  { field: "bronze", width: 100 },
  { field: "total", width: 100 },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  onColumnResized: (params: ColumnResizedEvent) => {
    console.log(params);
  },
  autoSizeStrategy: {
    type: "fitCellContents",
  },
};

function autoSizeAll(skipHeader: boolean) {
  const allColumnIds: string[] = [];
  gridApi!.getColumns()!.forEach((column) => {
    allColumnIds.push(column.getId());
  });

  gridApi!.autoSizeColumns(allColumnIds, skipHeader);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).autoSizeAll = autoSizeAll;
}
