import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IAggFunc,
  IAggFuncParams,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "total", aggFunc: "range" },
    {
      headerName: "Gold to Silver",
      colId: "goldSilverRatio",
      aggFunc: "ratio",
      valueGetter: ratioValueGetter,
      valueFormatter: ratioFormatter,
    },
  ],
  aggFuncs: {
    range: (params) => {
      const values = params.values;
      return values.length > 0
        ? Math.max(...values) - Math.min(...values)
        : null;
    },
    ratio: ratioAggFunc,
  },
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    minWidth: 220,
  },
};

function ratioValueGetter(params: ValueGetterParams<IOlympicData>) {
  if (!(params.node && params.node.group)) {
    // no need to handle group levels - calculated in the 'ratioAggFunc'
    return createValueObject(params.data!.gold, params.data!.silver);
  }
}

function ratioAggFunc(params: IAggFuncParams) {
  let goldSum = 0;
  let silverSum = 0;
  params.values.forEach((value) => {
    if (value && value.gold) {
      goldSum += value.gold;
    }
    if (value && value.silver) {
      silverSum += value.silver;
    }
  });
  return createValueObject(goldSum, silverSum);
}

function createValueObject(gold: number, silver: number) {
  return {
    gold: gold,
    silver: silver,
    toString: () => `${gold && silver ? gold / silver : 0}`,
  };
}

function ratioFormatter(params: ValueFormatterParams) {
  if (!params.value || params.value === 0) return "";
  return "" + Math.round(params.value * 100) / 100;
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
