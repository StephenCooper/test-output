let gridApi;
let chartRef;

const heatmapColIds = [
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
const heatmapColDefs = [
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

const waterfallColIds = ["financials", "amount"];
const waterfallColDefs = [
  { field: "financials", width: 150, chartDataType: "category" },
  { field: "amount", chartDataType: "series" },
];

const gridOptions = {
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
  onGridReady: (params) => {
    getData("heatmap").then((rowData) =>
      params.api.setGridOption("rowData", rowData),
    );
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params) {
  chartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart"),
    chartType: "heatmap",
    cellRange: {
      columns: heatmapColIds,
    },
  });
}

function updateChart(chartType) {
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
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(
    gridDiv,
    gridOptions,
  ); /** DARK INTEGRATED START **/
  const isInitialModeDark =
    document.documentElement.dataset.agThemeMode?.includes("dark");

  const updateChartThemes = (isDark) => {
    const themes = [
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

    let modifiedThemes = customTheme
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

  const handleColorSchemeChange = (event) => {
    const { darkMode } = event.detail;
    updateChartThemes(darkMode);
  };

  // listen for user-triggered dark mode changes (not removing listener is fine here!)
  document.addEventListener("color-scheme-change", handleColorSchemeChange);
  /** DARK INTEGRATED END **/
});
