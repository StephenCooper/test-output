import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CustomPinnedRowRenderer } from "./customPinnedRowRenderer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  PinnedRowModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    field: "athlete",
    cellRendererSelector: (params) => {
      if (params.node.rowPinned) {
        return {
          component: CustomPinnedRowRenderer,
          params: {
            style: { color: "#5577CC" },
          },
        };
      } else {
        // rows that are not pinned don't use any cell renderer
        return undefined;
      }
    },
  },
  {
    field: "country",
    cellRendererSelector: (params) => {
      if (params.node.rowPinned) {
        return {
          component: CustomPinnedRowRenderer,
          params: {
            style: { fontStyle: "italic" },
          },
        };
      } else {
        // rows that are not pinned don't use any cell renderer
        return undefined;
      }
    },
  },
  { field: "sport" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
  },
  columnDefs: columnDefs,
  getRowStyle: (params: RowClassParams): RowStyle | undefined => {
    if (params.node.rowPinned) {
      return { fontWeight: "bold" };
    }
  },
  // no rows to pin to start with
  pinnedTopRowData: [
    {
      athlete: "TOP 1 (athlete)",
      country: "TOP 1 (country)",
      sport: "TOP 1 (sport)",
    },
    {
      athlete: "TOP 2 (athlete)",
      country: "TOP 2 (country)",
      sport: "TOP 2 (sport)",
    },
  ],
  pinnedBottomRowData: [
    {
      athlete: "BOTTOM 1 (athlete)",
      country: "BOTTOM 1 (country)",
      sport: "BOTTOM 1 (sport)",
    },
    {
      athlete: "BOTTOM 2 (athlete)",
      country: "BOTTOM 2 (country)",
      sport: "BOTTOM 2 (sport)",
    },
  ],
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
