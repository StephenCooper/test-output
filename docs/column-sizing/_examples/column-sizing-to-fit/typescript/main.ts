import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnAutoSizeModule,
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
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", width: 150, suppressSizeToFit: true },
  { field: "age", width: 50, maxWidth: 50 },
  { colId: "country", field: "country", maxWidth: 300 },
  { field: "year", width: 90 },
  { field: "sport", width: 110 },
  { field: "gold", width: 100 },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  autoSizeStrategy: {
    type: "fitGridWidth",
    defaultMinWidth: 100,
    columnLimits: [
      {
        colId: "country",
        minWidth: 900,
      },
    ],
  },
};

function sizeToFit() {
  gridApi!.sizeColumnsToFit({
    defaultMinWidth: 100,
    columnLimits: [{ key: "country", minWidth: 900 }],
  });
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).sizeToFit = sizeToFit;
}
