let gridApi;
let chartModel;
let currentChartRef;

const gridOptions = {
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
  onGridReady: (params) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
  createChartContainer,
};

function onFirstDataRendered(params) {
  currentChartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart"),
    cellRange: {
      columns: ["country", "sugar", "fat", "weight"],
      rowStartIndex: 0,
      rowEndIndex: 2,
    },
    chartType: "groupedColumn",
  });
}

function createChartContainer(chartRef) {
  if (currentChartRef) {
    currentChartRef.destroyChart();
  }

  const eChart = chartRef.chartElement;
  const eParent = document.querySelector("#myChart");
  eParent.appendChild(eChart);
  currentChartRef = chartRef;
}

function saveChart() {
  const chartModels = gridApi.getChartModels() || [];
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
  currentChartRef = gridApi.restoreChart(chartModel);
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
