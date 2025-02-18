import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IsRowFilterable,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year" },
    { field: "total", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ],
  defaultColDef: {
    flex: 1,
    floatingFilter: true,
  },
  autoGroupColumnDef: {
    field: "athlete",
  },
  groupDefaultExpanded: -1,
  groupAggFiltering: true,

  onGridReady: (params) => {
    document.querySelector<HTMLInputElement>("#groupAggFiltering")!.checked =
      true;
    params.api.setFilterModel({
      total: {
        type: "contains",
        filter: "192",
      },
    });
  },
};

function toggleProperty() {
  const enable =
    document.querySelector<HTMLInputElement>("#groupAggFiltering")!.checked;
  gridApi.setGridOption("groupAggFiltering", enable);
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
