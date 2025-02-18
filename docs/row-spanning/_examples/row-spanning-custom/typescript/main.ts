import {
  CellSpanModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SpanRowsParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  CellSpanModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const customSpanFunc = ({ valueA, valueB }: SpanRowsParams) => {
  return valueA != "Algeria" && valueA === valueB;
};

const columnDefs: ColDef[] = [
  { field: "country", spanRows: customSpanFunc, sort: "asc" },
  { field: "year", spanRows: true, sort: "asc" },
  { field: "sport", spanRows: true, sort: "asc" },
  { field: "athlete" },
  { field: "age" },
  { field: "total" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
  },
  enableCellSpan: true,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
