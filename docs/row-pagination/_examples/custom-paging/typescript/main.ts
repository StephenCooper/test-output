import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  PaginationNumberFormatterParams,
  RowSelectionModule,
  RowSelectionOptions,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    headerName: "Athlete",
    field: "athlete",
    minWidth: 170,
  },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    editable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  },
  rowSelection: {
    mode: "multiRow",
    groupSelects: "descendants",
  },
  columnDefs,
  pagination: true,
  paginationPageSize: 500,
  paginationPageSizeSelector: [200, 500, 1000],
  onFirstDataRendered: onFirstDataRendered,
  paginationNumberFormatter: (params: PaginationNumberFormatterParams) => {
    return "[" + params.value.toLocaleString() + "]";
  },
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.paginationGoToPage(4);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    gridApi!.setGridOption("rowData", data);
  });
