import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { CustomGroupCellRenderer } from "./customGroupCellRenderer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    field: "country",
    rowGroup: true,
    hide: true,
  },
  {
    field: "year",
    rowGroup: true,
    hide: true,
  },
  {
    field: "athlete",
  },
  {
    field: "total",
    aggFunc: "sum",
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  autoGroupColumnDef: {
    cellRenderer: CustomGroupCellRenderer,
  },
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  groupDefaultExpanded: 1,
  onCellDoubleClicked: (params: CellDoubleClickedEvent<IOlympicData, any>) => {
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  },
  onCellKeyDown: (params: CellKeyDownEvent<IOlympicData, any>) => {
    if (!("colDef" in params)) {
      return;
    }
    if (!(params.event instanceof KeyboardEvent)) {
      return;
    }
    if (params.event.code !== "Enter") {
      return;
    }
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
