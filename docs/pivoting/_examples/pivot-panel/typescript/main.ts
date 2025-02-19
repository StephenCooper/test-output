import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  SideBarModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PivotModule,
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, enableRowGroup: true },
    { field: "sport", pivot: true, enablePivot: true },
    { field: "year", pivot: true, enablePivot: true },
    { field: "gold", aggFunc: "sum", enableValue: true },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 130,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  pivotMode: true,
  pivotPanelShow: "onlyWhenPivoting",

  sideBar: {
    defaultToolPanel: "columns",
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
    ],
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
