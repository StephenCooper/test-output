import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartRef,
  ChartRefParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
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

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "athlete", width: 150, chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
    { field: "total", chartDataType: "series" },
  ],
  defaultColDef: { flex: 1 },
  cellSelection: true,
  enableCharts: true,
  popupParent: document.body,
  createChartContainer,
};

function updateChart(chartRef: ChartRef | undefined) {
  const eParent = document.querySelector("#chartParent") as HTMLElement;
  eParent.innerHTML = ""; // Clear existing content
  const placeHolder = `<div class="chart-placeholder">Chart will be displayed here.</div>`;

  if (chartRef) {
    const chartWrapperHTML = `
    <div class="chart-wrapper">
      <div class="chart-wrapper-top">
        <h2 class="chart-wrapper-title">Chart created ${new Date().toLocaleString()}</h2>
        <button class="chart-wrapper-close">Destroy Chart</button>
      </div>
      <div class="chart-wrapper-body"></div>
    </div>
  `;
    eParent.insertAdjacentHTML("beforeend", chartWrapperHTML);
    const eChartWrapper = eParent.lastElementChild as HTMLElement;

    eChartWrapper
      .querySelector(".chart-wrapper-body")!
      .appendChild(chartRef.chartElement);
    eChartWrapper
      .querySelector(".chart-wrapper-close")!
      .addEventListener("click", () => {
        chartRef.destroyChart();
        eParent.innerHTML = placeHolder;
      });
  } else {
    eParent.innerHTML = placeHolder;
  }
}

// Function for creating the chart container
function createChartContainer(chartRef: ChartRef): void {
  updateChart(chartRef);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
updateChart(undefined);

fetch("https://www.ag-grid.com/example-assets/wide-spread-of-sports.json")
  .then((response) => response.json())
  .then(function (data) {
    gridApi!.setGridOption("rowData", data);
  });
/** DARK INTEGRATED START **/
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
