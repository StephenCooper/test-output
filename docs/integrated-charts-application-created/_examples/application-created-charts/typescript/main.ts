import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellStyleModule,
  ChartToolbarMenuItemOptions,
  ChartType,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  ColumnApiModule,
  GetChartToolbarItems,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { IntegratedChartsModule, RowGroupingModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelApiModule,
  TextEditorModule,
  TextFilterModule,
  NumberEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  RowGroupingModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

declare let __basePath: string;

// Types
interface WorkerMessage {
  type: string;
  records?: any[];
}

// Global variables
let chartRef: any;
let gridApi: GridApi;
let worker: Worker;

// Column Definitions
function getColumnDefs(): ColDef[] {
  return [
    { field: "product", chartDataType: "category", minWidth: 110 },
    { field: "book", chartDataType: "category", minWidth: 100 },
    { field: "current", type: "measure" },
    { field: "previous", type: "measure" },
    { headerName: "PL 1", field: "pl1", type: "measure" },
    { headerName: "PL 2", field: "pl2", type: "measure" },
    { headerName: "Gain-DX", field: "gainDx", type: "measure" },
    { headerName: "SX / PX", field: "sxPx", type: "measure" },

    { field: "trade", type: "measure" },
    { field: "submitterID", type: "measure" },
    { field: "submitterDealID", type: "measure" },

    { field: "portfolio" },
    { field: "dealType" },
    { headerName: "Bid", field: "bidFlag" },
  ];
}

// Grid Options
const gridOptions: GridOptions = {
  columnDefs: getColumnDefs(),
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 140,
    filter: true,
  },
  columnTypes: {
    measure: {
      chartDataType: "series",
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
  },
  enableCharts: true,
  suppressAggFuncInHeader: true,
  getRowId: (params: GetRowIdParams) => String(params.data.trade),
  getChartToolbarItems: (): ChartToolbarMenuItemOptions[] => [],
  onFirstDataRendered,
};

// Initial Chart Creation
function onFirstDataRendered(params: any) {
  chartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart") as any,
    cellRange: {
      columns: [
        "product",
        "current",
        "previous",
        "pl1",
        "pl2",
        "gainDx",
        "sxPx",
      ],
    },
    suppressChartRanges: true,
    chartType: "groupedColumn",
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        animation: {
          enabled: false,
        },
      },
    },
  });
}

function updateChart(chartType: ChartType) {
  gridApi!.updateChart({
    type: "rangeChartUpdate",
    chartId: chartRef.chartId,
    chartType,
  });
}

function numberCellFormatter(params: ValueFormatterParams) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function startWorker(): void {
  worker = new Worker(`${__basePath || "."}/dataUpdateWorker.js`);
  worker.addEventListener("message", handleWorkerMessage);
  worker.postMessage("start");
}

function handleWorkerMessage(e: any): void {
  if (e.data.type === "setRowData") {
    gridApi!.setGridOption("rowData", e.data.records);
  }
  if (e.data.type === "updateData") {
    gridApi!.applyTransactionAsync({ update: e.data.records });
  }
}

// after page is loaded, create the grid
const eGridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(eGridDiv, gridOptions);

// IIFE
(function () {
  startWorker();
})();

// Worker Commands
function onStartLoad(): void {
  worker.postMessage("start");
}

function onStopMessages(): void {
  worker.postMessage("stop");
}

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).updateChart = updateChart;
  (<any>window).onStartLoad = onStartLoad;
  (<any>window).onStopMessages = onStopMessages;
} /** DARK INTEGRATED START **/
const isInitialModeDark =
  document.documentElement.dataset.agThemeMode?.includes("dark");

// update chart themes based on dark mode status
const updateChartThemes = (isDark: boolean): void => {
  const themes: string[] = [
    "ag-default",
    "ag-material",
    "ag-sheets",
    "ag-polychroma",
    "ag-vivid",
  ];
  const currentThemes = gridApi.getGridOption("chartThemes");
  const customTheme =
    currentThemes &&
    currentThemes.some((theme) => theme.startsWith("my-custom-theme"));

  let modifiedThemes: string[] = customTheme
    ? isDark
      ? ["my-custom-theme-dark", "my-custom-theme-light"]
      : ["my-custom-theme-light", "my-custom-theme-dark"]
    : Array.from(
        new Set(themes.map((theme) => theme + (isDark ? "-dark" : ""))),
      );

  // updating the 'chartThemes' grid option will cause the chart to reactively update!
  gridApi.setGridOption("chartThemes", modifiedThemes);
};

// update chart themes when example first loads
let initialSet = false;
const maxTries = 5;
let tries = 0;
const trySetInitial = (delay) => {
  if (gridApi) {
    initialSet = true;
    updateChartThemes(isInitialModeDark);
  } else {
    if (tries < maxTries) {
      setTimeout(() => trySetInitial(), 250);
      tries++;
    }
  }
};
trySetInitial(0);

interface ColorSchemeChangeEventDetail {
  darkMode: boolean;
}

// event handler for color scheme changes
const handleColorSchemeChange = (
  event: CustomEvent<ColorSchemeChangeEventDetail>,
): void => {
  const { darkMode } = event.detail;
  updateChartThemes(darkMode);
};

// listen for user-triggered dark mode changes (not removing listener is fine here!)
document.addEventListener(
  "color-scheme-change",
  handleColorSchemeChange as EventListener,
);
/** DARK INTEGRATED END **/
