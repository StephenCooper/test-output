let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Country",
      field: "country",
      valueFormatter: countryValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        valueFormatter: countryValueFormatter,
        keyCreator: countryCodeKeyCreator,
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    floatingFilter: true,
    cellDataType: false,
  },
  sideBar: "filters",
  onFirstDataRendered: onFirstDataRendered,
};

function countryCodeKeyCreator(params) {
  const countryObject = params.value;
  return countryObject.code;
}

function countryValueFormatter(params) {
  return params.value.name;
}

function printFilterModel() {
  const filterModel = gridApi.getFilterModel();
  console.log(filterModel);
}

function onFirstDataRendered(params) {
  params.api.getToolPanelInstance("filters").expandFilters();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      // hack the data, replace each country with an object of country name and code.
      // also make country codes unique
      const uniqueCountryCodes = new Map();
      const newData = [];
      data.forEach(function (row) {
        const countryName = row.country;
        const countryCode = countryName.substring(0, 2).toUpperCase();
        const uniqueCountryName = uniqueCountryCodes.get(countryCode);
        if (!uniqueCountryName || uniqueCountryName === countryName) {
          uniqueCountryCodes.set(countryCode, countryName);
          row.country = {
            name: countryName,
            code: countryCode,
          };
          newData.push(row);
        }
      });

      gridApi.setGridOption("rowData", newData);
    });
});
