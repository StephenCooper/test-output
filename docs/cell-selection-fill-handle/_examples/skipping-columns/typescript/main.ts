import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    editable: true,
    cellDataType: false,
  },
  cellSelection: {
    handle: {
      mode: "fill",
      suppressClearOnFillReduction: true,
      setFillValue(params) {
        if (params.column.getColId() === "country") {
          return params.currentCellValue;
        }

        return params.values[params.values.length - 1];
      },
    },
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data) => gridApi.setGridOption("rowData", data));
