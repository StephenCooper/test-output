import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IAggFunc,
  ModuleRegistry,
  UseGroupTotalRow,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ColumnMenuModule, RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "bronze", aggFunc: "sum" },
    { field: "silver", aggFunc: "2x+1" },
    { field: "gold", aggFunc: "avg" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  grandTotalRow: "bottom",
  groupTotalRow: "bottom",
  aggFuncs: {
    "2x+1": (params) => {
      const value = params.values[0];
      return 2 * value + 1;
    },
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
