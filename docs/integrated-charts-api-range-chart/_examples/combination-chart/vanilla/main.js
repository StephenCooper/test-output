let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "day", maxWidth: 120 },
    {
      field: "month",
      chartDataType: "category",
      filterParams: {
        comparator: (a, b) => {
          const months = {
            jan: 1,
            feb: 2,
            mar: 3,
            apr: 4,
            may: 5,
            jun: 6,
            jul: 7,
            aug: 8,
            sep: 9,
            oct: 10,
            nov: 11,
            dec: 12,
          };
          const valA = months[a.toLowerCase()];
          const valB = months[b.toLowerCase()];
          if (valA === valB) return 0;
          return valA > valB ? 1 : -1;
        },
      },
    },
    { field: "rain", chartDataType: "series" },
    { field: "pressure", chartDataType: "series" },
    { field: "temp", chartDataType: "series" },
    { field: "wind", chartDataType: "series" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    editable: true,
    filter: true,
    floatingFilter: true,
  },
  cellSelection: true,
  enableCharts: true,
  popupParent: document.body,
  chartThemeOverrides: {
    common: {
      axes: {
        number: {
          title: {
            enabled: true,
            formatter: (params) => {
              return params.boundSeries.map((s) => s.name).join(" / ");
            },
          },
        },
      },
    },
    bar: {
      series: {
        strokeWidth: 2,
        fillOpacity: 0.8,
      },
    },
    line: {
      series: {
        strokeWidth: 5,
        strokeOpacity: 0.8,
        marker: {
          enabled: false,
        },
      },
    },
  },
  onGridReady: (params) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params) {
  params.api.createRangeChart({
    chartType: "customCombo",
    cellRange: {
      columns: ["month", "rain", "pressure", "temp"],
    },
    seriesChartTypes: [
      { colId: "rain", chartType: "groupedColumn", secondaryAxis: false },
      { colId: "pressure", chartType: "line", secondaryAxis: true },
      { colId: "temp", chartType: "line", secondaryAxis: true },
    ],
    aggFunc: "sum",
    suppressChartRanges: true,
    chartContainer: document.querySelector("#myChart"),
  });
}

// set up the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  gridApi = agGrid.createGrid(
    document.querySelector("#myGrid"),
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
