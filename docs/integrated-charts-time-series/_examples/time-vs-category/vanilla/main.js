let gridApi;
let currentChartRef;

function getColumnDefs() {
  return [
    { field: "date", valueFormatter: dateFormatter },
    { field: "avgTemp" },
  ];
}

const gridOptions = {
  columnDefs: getColumnDefs(),
  defaultColDef: { flex: 1 },
  cellSelection: true,
  enableCharts: true,
  chartThemeOverrides: {
    line: {
      title: {
        enabled: true,
        text: "Average Daily Temperatures",
      },
      navigator: {
        enabled: true,
        height: 20,
        spacing: 25,
      },
      axes: {
        time: {
          label: {
            rotation: 0,
            format: "%d %b",
          },
        },
        category: {
          label: {
            rotation: 0,
            formatter: (params) => {
              // charts typings
              return formatDate(params.value);
            },
          },
        },
        number: {
          label: {
            formatter: (params) => {
              // charts typings
              return params.value + "°C";
            },
          },
        },
      },
      series: {
        tooltip: {
          renderer: ({ datum, xKey, yKey }) => {
            return {
              content: `${formatDate(datum[xKey])}: ${Math.round(datum[yKey])}°C`,
            };
          },
        },
      },
    },
  },
  chartToolPanelsDef: {
    panels: ["data", "format"],
  },
  onGridReady: (params) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params) {
  if (currentChartRef) {
    currentChartRef.destroyChart();
  }

  currentChartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart"),
    cellRange: {
      columns: ["date", "avgTemp"],
    },
    suppressChartRanges: true,
    chartType: "line",
  });
}

function dateFormatter(params) {
  return params.value
    ? params.value.toISOString().substring(0, 10)
    : params.value;
}

function toggleAxis() {
  const axisBtn = document.querySelector("#axisBtn");
  axisBtn.textContent = axisBtn.value;
  axisBtn.value = axisBtn.value === "time" ? "category" : "time";

  const columnDefs = getColumnDefs();
  columnDefs.forEach((colDef) => {
    if (colDef.field === "date") {
      colDef.chartDataType = axisBtn.value;
    }
  });

  gridApi.setGridOption("columnDefs", columnDefs);
}

function formatDate(date) {
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: undefined,
  }).format(new Date(date));
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
