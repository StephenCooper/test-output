import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  UseGroupTotalRow,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "sport", filter: "agTextColumnFilter", floatingFilter: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    minWidth: 300,
  },
  groupTotalRow: "bottom",
  onGridReady: (params) => {
    params.api.setFilterModel({
      sport: {
        type: "contains",
        filter: "Swimming",
      },
    });
  },
};

function toggleProperty() {
  const enable = document.querySelector<HTMLInputElement>(
    "#suppressAggFilteredOnly",
  )!.checked;
  gridApi.setGridOption("suppressAggFilteredOnly", enable);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).toggleProperty = toggleProperty;
}
