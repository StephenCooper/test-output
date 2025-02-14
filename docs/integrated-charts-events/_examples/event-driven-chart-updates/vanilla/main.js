let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "Month", width: 150, chartDataType: "category" },
    { field: "Sunshine (hours)", chartDataType: "series" },
    { field: "Rainfall (mm)", chartDataType: "series" },
  ],
  defaultColDef: { flex: 1 },
  cellSelection: true,
  popupParent: document.body,
  enableCharts: true,
  chartThemeOverrides: {
    common: {
      title: { enabled: true, text: "Monthly Weather" },
      subtitle: { enabled: true },
      legend: { enabled: true },
    },
  },
  onFirstDataRendered: onFirstDataRendered,
  onChartCreated: onChartCreated,
  onChartRangeSelectionChanged: onChartRangeSelectionChanged,
  onChartOptionsChanged: onChartOptionsChanged,
};

function onFirstDataRendered(params) {
  const createRangeChartParams = {
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 3,
      columns: ["Month", "Sunshine (hours)"],
    },
    chartType: "stackedColumn",
    chartContainer: document.querySelector("#myChart"),
  };

  params.api.createRangeChart(createRangeChartParams);
}

function onChartCreated(event) {
  console.log("Created chart with ID " + event.chartId);
  updateTitle(gridApi, event.chartId);
}

function onChartRangeSelectionChanged(event) {
  console.log("Changed range selection of chart with ID " + event.chartId);
  updateTitle(gridApi, event.chartId);
}

function onChartOptionsChanged(event) {
  console.log("Changed options of chart with ID " + event.chartId);
}

function updateTitle(api, chartId) {
  const cellRange = api.getCellRanges()[1];
  if (!cellRange) return;
  const columnCount = cellRange.columns.length;
  const rowCount = cellRange.endRow.rowIndex - cellRange.startRow.rowIndex + 1;
  const subtitle = `Using series data from ${columnCount} column(s) and ${rowCount} row(s)`;

  api.updateChart({
    type: "rangeChartUpdate",
    chartId: chartId,
    chartThemeOverrides: {
      common: {
        subtitle: { text: subtitle },
      },
    },
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

  fetch("https://www.ag-grid.com/example-assets/weather-se-england.json")
    .then((response) => response.json())
    .then(function (data) {
      gridApi.setGridOption("rowData", data);
    });
});
