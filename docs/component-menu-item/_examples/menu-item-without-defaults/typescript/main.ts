import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetMainMenuItems,
  GetMainMenuItemsParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { MenuItem } from "./menuItem";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
    suppressHeaderFilterButton: true,
  },
  columnDefs: columnDefs,
  getMainMenuItems: (params: GetMainMenuItemsParams) => {
    return [
      ...params.defaultItems.filter((item) => item !== "columnFilter"),
      "separator",
      {
        name: "Filter",
        menuItem: MenuItem,
        menuItemParams: {
          column: params.column,
        },
      },
    ];
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
