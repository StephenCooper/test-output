import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  SideBarDef,
  TextEditorModule,
  ValidationModule,
  createGrid,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "country", sort: "asc", rowGroup: true, hide: true },
  { field: "athlete", minWidth: 170 },
  { field: "age" },
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
  rowData: null,
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  autoGroupColumnDef: {
    headerName: "Country",
  },
  sideBar: true,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
