import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartRef,
  ChartToolPanelsDef,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;
let chartRef: ChartRef;

const heatmapColIds: string[] = [
  "year",
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const heatmapColDefs: ColDef[] = [
  { field: "year", width: 150, chartDataType: "category" },
  { field: "jan" },
  { field: "feb" },
  { field: "mar" },
  { field: "apr" },
  { field: "may" },
  { field: "jun" },
  { field: "jul" },
  { field: "aug" },
  { field: "sep" },
  { field: "oct" },
  { field: "nov" },
  { field: "dec" },
];

const waterfallColIds: string[] = ["financials", "amount"];
const waterfallColDefs: ColDef[] = [
  { field: "financials", width: 150, chartDataType: "category" },
  { field: "amount", chartDataType: "series" },
];

const gridOptions: GridOptions = {
  columnDefs: heatmapColDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  popupParent: document.body,
  cellSelection: true,
  enableCharts: true,
  chartToolPanelsDef: {
    defaultToolPanel: "settings",
  },
  onGridReady: (params: GridReadyEvent) => {
    getData("heatmap").then((rowData) =>
      params.api.setGridOption("rowData", rowData),
    );
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  chartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart") as any,
    chartType: "heatmap",
    cellRange: {
      columns: heatmapColIds,
    },
  })!;
}

function updateChart(chartType: "heatmap" | "waterfall") {
  getData(chartType).then((rowData) => {
    gridApi.updateGridOptions({
      columnDefs: chartType === "heatmap" ? heatmapColDefs : waterfallColDefs,
      rowData,
    });
    setTimeout(() => {
      gridApi.updateChart({
        type: "rangeChartUpdate",
        chartId: chartRef.chartId,
        chartType,
        cellRange: {
          columns: chartType === "heatmap" ? heatmapColIds : waterfallColIds,
        },
      });
    });
  });
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).updateChart = updateChart;
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
