import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IFilterPlaceholderFunctionParams,
  INumberFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef<IOlympicData>[] = [
  {
    field: "athlete",
  },
  {
    field: "country",
    filter: "agTextColumnFilter",
    filterParams: {
      filterPlaceholder: "Country...",
    } as ITextFilterParams,
  },
  {
    field: "sport",
    filter: "agTextColumnFilter",
    filterParams: {
      filterPlaceholder: (params: IFilterPlaceholderFunctionParams) => {
        const { filterOptionKey, placeholder } = params;
        return `${filterOptionKey} - ${placeholder}`;
      },
    } as ITextFilterParams,
  },
  {
    field: "total",
    filter: "agNumberColumnFilter",
    filterParams: {
      filterPlaceholder: (params: IFilterPlaceholderFunctionParams) => {
        const { filterOption } = params;
        return `${filterOption} total`;
      },
    } as INumberFilterParams,
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => gridApi!.setGridOption("rowData", data));
