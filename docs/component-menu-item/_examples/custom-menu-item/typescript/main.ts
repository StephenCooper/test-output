import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GetMainMenuItems,
  GetMainMenuItemsParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
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
  },
  columnDefs: columnDefs,
  rowData: null,
  getMainMenuItems: (params: GetMainMenuItemsParams) => {
    return [
      ...params.defaultItems,
      "separator",
      {
        name: "Click Alert Button and Close Menu",
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
      {
        name: "Click Alert Button and Keep Menu Open",
        suppressCloseOnSelect: true,
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
    ];
  },
  getContextMenuItems: (params: GetContextMenuItemsParams) => {
    return [
      ...(params.defaultItems || []),
      "separator",
      {
        name: "Click Alert Button and Close Menu",
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
      {
        name: "Click Alert Button and Keep Menu Open",
        suppressCloseOnSelect: true,
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
    ];
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
