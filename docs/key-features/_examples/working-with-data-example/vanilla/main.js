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
    {
      field: "make",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Tesla",
          "Ford",
          "Toyota",
          "Mercedes",
          "Fiat",
          "Nissan",
          "Vauxhall",
          "Volvo",
          "Jaguar",
        ],
      },
    },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
    { field: "electric" },
    {
      field: "month",
      comparator: (valueA, valueB) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const idxA = months.indexOf(valueA);
        const idxB = months.indexOf(valueB);
        return idxA - idxB;
      },
    },
  ],
  defaultColDef: {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  },
  rowSelection: {
    mode: "multiRow",
    headerCheckbox: false,
  },
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 25, 50],
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  const gridApi = agGrid.createGrid(
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
