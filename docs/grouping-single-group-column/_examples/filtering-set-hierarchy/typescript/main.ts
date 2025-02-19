import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  KeyCreatorParams,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true, filter: true },
    { field: "year", rowGroup: true, hide: true, filter: true },
    { field: "athlete" },
    { field: "sport" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
    filter: true,
    floatingFilter: true,
    filterValueGetter: (params) => params.data?.athlete,
    filterParams: {
      treeList: true,
      keyCreator: (params: KeyCreatorParams) =>
        params.value ? params.value.join("#") : null,
    },
  },
  groupDefaultExpanded: 1,
  onGridReady: (params) => {
    params.api.showColumnFilter("ag-Grid-AutoColumn");
  },
};

var gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
