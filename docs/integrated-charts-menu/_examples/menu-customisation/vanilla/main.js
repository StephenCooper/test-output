let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", width: 150, chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
  ],
  defaultColDef: { flex: 1 },
  cellSelection: true,
  popupParent: document.body,
  enableCharts: true,
  chartMenuItems: chartMenuItems,
  onGridReady: (params) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function chartMenuItems(params) {
  // Remove edit chart and advanced settings.
  // `defaultItems` will automatically update the link/unlink options based on the current state.
  return params.defaultItems.filter((item) => {
    return item !== "chartEdit" && item !== "chartAdvancedSettings";
  });
}

function onFirstDataRendered(params) {
  params.api.createRangeChart({
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 4,
      columns: ["country", "gold", "silver", "bronze"],
    },
    chartType: "groupedColumn",
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
