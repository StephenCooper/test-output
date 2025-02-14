let gridApi;
let chartId;

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
  chartThemeOverrides: {
    bar: {
      axes: {
        category: {
          label: {
            rotation: 335,
          },
        },
      },
    },
  },
  onGridReady: (params) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
  onChartCreated,
};

function onFirstDataRendered(params) {
  const createRangeChartParams = {
    cellRange: {
      columns: ["country", "sugar", "fat", "weight"],
    },
    chartType: "groupedColumn",
    chartContainer: document.querySelector("#myChart"),
  };

  params.api.createRangeChart(createRangeChartParams);
}

function onChartCreated(event) {
  chartId = event.chartId;
}

function downloadChart(dimensions) {
  if (!chartId) return;
  gridApi.downloadChart({
    fileName: "resizedImage",
    fileFormat: "image/jpeg",
    chartId,
    dimensions,
  });
}

function downloadChartImage(fileFormat) {
  if (!chartId) return;
  const params = { fileFormat, chartId };
  const imageDataURL = gridApi.getChartImageDataURL(params);

  if (imageDataURL) {
    const a = document.createElement("a");
    a.href = imageDataURL;
    a.download = "image";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function openChartImage(fileFormat) {
  if (!chartId) return;
  const params = { fileFormat, chartId };
  const imageDataURL = gridApi.getChartImageDataURL(params);

  if (imageDataURL) {
    const image = new Image();
    image.src = imageDataURL;

    const w = window.open("");
    w.document.write(image.outerHTML);
    w.document.close();
  }
}

// setup the grid after the page has finished loading
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
