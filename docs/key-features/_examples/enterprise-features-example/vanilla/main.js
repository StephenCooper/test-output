let gridApi;

const gridOptions = {
  rowData: [
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
  ],
  columnDefs: [
    // Group by 'make', hiding it once grouped
    { field: "make", rowGroup: true, hide: true },
    { field: "model" },
    // Aggregate the average price per group
    { field: "price", filter: "agNumberColumnFilter", aggFunc: "avg" },
    { field: "electric" },
    { field: "month" },
  ],
  defaultColDef: {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    sortable: true,
    resizable: true,
  },
  groupDisplayType: "singleColumn",
  cellSelection: true,
  enableCharts: true,
  onFirstDataRendered: (params) => {
    params.api.createRangeChart({
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 8,
        columns: ["model", "price"],
      },
      chartType: "groupedColumn",
      chartThemeOverrides: {
        common: {
          title: {
            enabled: true,
            text: "Average Price by Make",
          },
        },
      },
    });
  },
  sideBar: {
    toolPanels: ["columns", "filters"],
    defaultToolPanel: "columns",
  },
};

const gridDiv = document.querySelector("#myGrid");
gridApi = agGrid.createGrid(gridDiv, gridOptions); /** DARK INTEGRATED START **/
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
