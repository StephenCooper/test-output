import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartModel,
  ChartRef,
  ChartRefParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
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
  TextEditorModule,
  TextFilterModule,
  NumberEditorModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;
let chartModel: ChartModel | undefined;
let currentChartRef: ChartRef | undefined;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "country", chartDataType: "category" },
    { field: "sugar", chartDataType: "series" },
    { field: "fat", chartDataType: "series" },
    { field: "weight", chartDataType: "series" },
  ],
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  cellSelection: true,
  popupParent: document.body,
  enableCharts: true,
  onGridReady: (params: GridReadyEvent) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
  createChartContainer,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  currentChartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart") as any,
    cellRange: {
      columns: ["country", "sugar", "fat", "weight"],
      rowStartIndex: 0,
      rowEndIndex: 2,
    },
    chartType: "groupedColumn",
  });
}

function createChartContainer(chartRef: ChartRef) {
  if (currentChartRef) {
    currentChartRef.destroyChart();
  }

  const eChart = chartRef.chartElement;
  const eParent = document.querySelector<HTMLElement>("#myChart")!;
  eParent.appendChild(eChart);
  currentChartRef = chartRef;
}

function saveChart() {
  const chartModels = gridApi!.getChartModels() || [];
  if (chartModels.length > 0) {
    chartModel = chartModels[0];
  }
}

function clearChart() {
  if (currentChartRef) {
    currentChartRef.destroyChart();
    currentChartRef = undefined;
  }
}

function restoreChart() {
  if (!chartModel) return;
  currentChartRef = gridApi!.restoreChart(chartModel)!;
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).saveChart = saveChart;
  (<any>window).clearChart = clearChart;
  (<any>window).restoreChart = restoreChart;
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
