let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "year", chartDataType: "category" },
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
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowData: generateData(),
  cellSelection: true,
  popupParent: document.body,
  enableCharts: true,
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart"),
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 79,
      columns: [
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
      ],
    },
    chartType: "line",
    aggFunc: "sum",
    switchCategorySeries: true,
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
