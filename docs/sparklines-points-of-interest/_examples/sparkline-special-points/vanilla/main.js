const palette = {
  blue: "rgb(20,94,140)",
  lightBlue: "rgb(182,219,242)",
  green: "rgb(63,141,119)",
  lightGreen: "rgba(75,168,142, 0.2)",
};

let gridApi;

const gridOptions = {
  rowHeight: 70,
  columnDefs: [
    {
      field: "bar",
      headerName: "Bar Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "bar",
          direction: "horizontal",
          min: 0,
          max: 100,
          label: {
            enabled: true,
            color: "#5577CC",
            placement: "outside-end",
            formatter: function (params) {
              return `${params.value}%`;
            },
            fontSize: 8,
            fontWeight: "bold",
            fontFamily: "Arial, Helvetica, sans-serif",
          },
          padding: {
            top: 15,
            bottom: 15,
          },
          itemStyler: barItemStyler,
        },
      },
    },
    {
      field: "line",
      headerName: "Line Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "line",
          stroke: "rgb(63,141,119)",
          padding: {
            top: 10,
            bottom: 10,
          },
          marker: {
            enabled: true,
            itemStyler: lineItemStyler,
          },
        },
      },
    },
    {
      field: "column",
      headerName: "Column Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "bar",
          direction: "vertical",
          label: {
            color: "#5577CC",
            enabled: true,
            placement: "outside-end",
            fontSize: 8,
            fontFamily: "Arial, Helvetica, sans-serif",
          },
          padding: {
            top: 15,
            bottom: 15,
          },
          itemStyler: columnItemStyler,
        },
      },
    },
    {
      field: "area",
      headerName: "Area Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "area",
          fill: "rgba(75,168,142, 0.2)",
          stroke: "rgb(63,141,119)",
          padding: {
            top: 10,
            bottom: 10,
          },
          marker: {
            enabled: true,
            itemStyler: areaItemStyler,
          },
        },
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowData: getData(),
};

function barItemStyler(params) {
  const { yValue, highlighted } = params;

  if (highlighted) {
    return;
  }
  return { fill: yValue <= 50 ? palette.lightBlue : palette.blue };
}

function lineItemStyler(params) {
  const { first, last, highlighted } = params;

  const color = highlighted
    ? palette.blue
    : last
      ? palette.lightBlue
      : palette.green;

  return {
    size: highlighted || first || last ? 5 : 0,
    fill: color,
    stroke: color,
  };
}

function columnItemStyler(params) {
  const { yValue, highlighted } = params;

  if (highlighted) {
    return;
  }
  return { fill: yValue < 0 ? palette.lightBlue : palette.blue };
}

function areaItemStyler(params) {
  const { min, highlighted } = params;

  return {
    size: min || highlighted ? 5 : 0,
    fill: palette.green,
    stroke: palette.green,
  };
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
