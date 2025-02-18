import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IMultiFilter,
  IMultiFilterParams,
  ISetFilter,
  ITextFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      field: "athlete",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: {
              buttons: ["apply", "clear"],
            } as ITextFilterParams,
          },
          {
            filter: "agSetColumnFilter",
          },
        ],
      } as IMultiFilterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  },
};

function getTextModel() {
  gridApi!
    .getColumnFilterInstance<IMultiFilter>("athlete")
    .then((multiFilterInstance) => {
      const textFilter = multiFilterInstance!.getChildFilterInstance(0)!;
      console.log("Current Text Filter model: ", textFilter.getModel());
    });
}

function getSetMiniFilter() {
  gridApi!
    .getColumnFilterInstance<IMultiFilter>("athlete")
    .then((multiFilterInstance) => {
      const setFilter = multiFilterInstance!.getChildFilterInstance(
        1,
      ) as ISetFilter;
      console.log(
        "Current Set Filter search text: ",
        setFilter.getMiniFilter(),
      );
    });
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).getTextModel = getTextModel;
  (<any>window).getSetMiniFilter = getSetMiniFilter;
}
