let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", pivot: true },
    { field: "year", rowGroup: true },
    { field: "sport", rowGroup: true },
    { field: "total", aggFunc: "sum" },
    { field: "gold", aggFunc: "sum" },
  ],
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  autoGroupColumnDef: {
    minWidth: 150,
  },
  pivotMode: true,
  onFirstDataRendered,
  popupParent: document.body,
};

function onFirstDataRendered(params) {
  params.api.createPivotChart({
    chartType: "groupedColumn",
    chartContainer: document.querySelector("#myChart"),
    chartThemeOverrides: {
      common: {
        navigator: {
          enabled: true,
          height: 10,
        },
      },
    },
  });

  // expand one row for demonstration purposes
  setTimeout(() => params.api.getDisplayedRowAtIndex(2).setExpanded(true), 0);
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

  fetch("https://www.ag-grid.com/example-assets/wide-spread-of-sports.json")
    .then((response) => response.json())
    .then(function (data) {
      gridApi.setGridOption("rowData", data);
    });
});
