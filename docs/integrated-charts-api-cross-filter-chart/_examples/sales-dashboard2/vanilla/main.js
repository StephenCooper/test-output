let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "salesRep", chartDataType: "category" },
    { field: "handset", chartDataType: "category" },
    {
      headerName: "Sale Price",
      field: "sale",
      maxWidth: 160,
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      chartDataType: "series",
    },
    {
      field: "saleDate",
      chartDataType: "category",
      filter: "agSetColumnFilter",
      filterParams: {
        valueFormatter: (params) => `${params.value}`,
      },
      sort: "asc",
    },
    {
      field: "quarter",
      maxWidth: 160,
      filter: "agSetColumnFilter",
      chartDataType: "category",
    },
  ],
  defaultColDef: {
    flex: 1,
    editable: true,
    filter: "agMultiColumnFilter",
    floatingFilter: true,
  },
  enableCharts: true,
  chartThemeOverrides: {
    bar: {
      axes: {
        category: {
          label: {
            rotation: 0,
          },
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
  createQuarterlySalesChart(params.api);
  createSalesByRefChart(params.api);
  createHandsetSalesChart(params.api);
}

function createQuarterlySalesChart(api) {
  api.createCrossFilterChart({
    chartType: "line",
    cellRange: {
      columns: ["quarter", "sale"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Quarterly Sales ($)",
        },
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
          number: {
            label: {
              formatter: (params) => {
                return params.value / 1000 + "k";
              },
            },
          },
        },
      },
    },
    chartContainer: document.querySelector("#lineChart"),
  });
}

function createSalesByRefChart(api) {
  api.createCrossFilterChart({
    chartType: "donut",
    cellRange: {
      columns: ["salesRep", "sale"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Sales by Representative ($)",
        },
      },
      pie: {
        legend: {
          position: "right",
        },
        series: {
          title: {
            enabled: false,
          },
          calloutLabel: {
            enabled: false,
          },
        },
      },
    },
    chartContainer: document.querySelector("#donutChart"),
  });
}

function createHandsetSalesChart(api) {
  api.createCrossFilterChart({
    chartType: "area",
    cellRange: {
      columns: ["handset", "sale"],
    },
    aggFunc: "count",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Handsets Sold (Units)",
        },
        padding: { left: 47, right: 80 },
      },
    },
    chartContainer: document.querySelector("#areaChart"),
  });
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
