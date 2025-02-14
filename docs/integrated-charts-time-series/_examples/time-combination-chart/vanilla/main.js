let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "date",
      chartDataType: "time",
      valueFormatter: (params) => params.value.toISOString().substring(0, 10),
    },
    { field: "rain", chartDataType: "series", valueParser: numberParser },
    { field: "pressure", chartDataType: "series", valueParser: numberParser },
    { field: "temp", chartDataType: "series", valueParser: numberParser },
  ],
  defaultColDef: { flex: 1 },
  cellSelection: true,
  popupParent: document.body,
  enableCharts: true,
  chartThemeOverrides: {
    common: {
      padding: {
        top: 45,
      },
      axes: {
        number: {
          title: {
            enabled: true,
            formatter: (params) => {
              return params.boundSeries.map((s) => s.name).join(" / ");
            },
          },
        },
        time: {
          crosshair: {
            label: {
              renderer: (params) => ({
                text: formatDate(params.value),
              }),
            },
          },
        },
      },
    },
    bar: {
      series: {
        strokeWidth: 2,
        fillOpacity: 0.8,
        tooltip: {
          renderer: chartTooltipRenderer,
        },
      },
    },
    line: {
      series: {
        strokeWidth: 5,
        strokeOpacity: 0.8,
        tooltip: {
          renderer: chartTooltipRenderer,
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
    chartContainer: document.querySelector("#myChart"),
    cellRange: {
      columns: ["date", "rain", "pressure", "temp"],
    },
    suppressChartRanges: true,
    seriesChartTypes: [
      { colId: "rain", chartType: "groupedColumn", secondaryAxis: false },
      { colId: "pressure", chartType: "line", secondaryAxis: true },
      { colId: "temp", chartType: "line", secondaryAxis: true },
    ],
    chartType: "customCombo",
    aggFunc: "sum",
  });
}

function numberParser(params) {
  const value = params.newValue;
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return parseFloat(value);
}

function chartTooltipRenderer({ datum, xKey, yKey }) {
  return {
    content: `${formatDate(datum[xKey])}: ${datum[yKey]}`,
  };
}

function formatDate(date) {
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: undefined,
  }).format(new Date(date));
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
