import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ITooltipParams,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const toolTipValueGetter = (params: ITooltipParams) =>
  params.value == null || params.value === "" ? "- Missing -" : params.value;

const columnDefs: ColDef[] = [
  {
    headerName: "A - Missing Value, NO Tooltip",
    field: "athlete",
    tooltipField: "athlete",
  },
  {
    headerName: "B - Missing Value, WITH Tooltip",
    field: "athlete",
    tooltipValueGetter: toolTipValueGetter,
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  tooltipShowDelay: 500,
  columnDefs: columnDefs,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    // set some blank values to test tooltip against
    data[0].athlete = undefined;
    data[1].athlete = null;
    data[2].athlete = "";
    gridApi!.setGridOption("rowData", data);
  });
