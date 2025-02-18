import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  RowHeightParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let swimmingHeight: number;
let groupHeight: number;
let usaHeight: number;

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "athlete" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  rowData: getData(),
  groupDefaultExpanded: 1,
  getRowHeight: getRowHeight,
};

function getRowHeight(
  params: RowHeightParams<IOlympicData>,
): number | undefined | null {
  if (params.node.group && groupHeight != null) {
    return groupHeight;
  } else if (
    params.data &&
    params.data.country === "United States" &&
    usaHeight != null
  ) {
    return usaHeight;
  } else if (
    params.data &&
    params.data.sport === "Swimming" &&
    swimmingHeight != null
  ) {
    return swimmingHeight;
  }
}

function setSwimmingHeight(height: number) {
  swimmingHeight = height;
  gridApi!.resetRowHeights();
}

function setGroupHeight(height: number) {
  groupHeight = height;
  gridApi!.resetRowHeights();
}

function setUsaHeight(height: number) {
  // this is used next time resetRowHeights is called
  usaHeight = height;

  gridApi!.forEachNode(function (rowNode) {
    if (rowNode.data && rowNode.data.country === "United States") {
      rowNode.setRowHeight(height);
    }
  });
  gridApi!.onRowHeightChanged();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).setSwimmingHeight = setSwimmingHeight;
  (<any>window).setGroupHeight = setGroupHeight;
  (<any>window).setUsaHeight = setUsaHeight;
}
