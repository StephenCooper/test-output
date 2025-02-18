import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ISetFilterParams,
  LocaleModule,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  LocaleModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    {
      headerName: "Default",
      field: "animal",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Excel (Windows)",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: {
        excelMode: "windows",
      } as ISetFilterParams,
    },
    {
      headerName: "Excel (Mac)",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: {
        excelMode: "mac",
      } as ISetFilterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
  },
  sideBar: "filters",
  rowData: getData(),
  localeText: {
    applyFilter: "OK",
    cancelFilter: "Cancel",
    resetFilter: "Clear Filter",
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
