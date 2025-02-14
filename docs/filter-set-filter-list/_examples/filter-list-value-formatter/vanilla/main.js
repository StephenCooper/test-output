let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "No Value Formatter",
      field: "country",
      valueFormatter: countryValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        // no value formatter!
      },
    },
    {
      headerName: "With Value Formatter",
      field: "country",
      valueFormatter: countryValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        valueFormatter: countryValueFormatter,
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 225,
    floatingFilter: true,
  },
  sideBar: "filters",
  onFirstDataRendered: onFirstDataRendered,
};

function countryValueFormatter(params) {
  const value = params.value;
  return value + " (" + COUNTRY_CODES[value].toUpperCase() + ")";
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
      // only return data that has corresponding country codes
      const dataWithFlags = data.filter(function (d) {
        return COUNTRY_CODES[d.country];
      });

      gridApi.setGridOption("rowData", dataWithFlags);
    });
});

var COUNTRY_CODES = {
  Ireland: "ie",
  Luxembourg: "lu",
  Belgium: "be",
  Spain: "es",
  France: "fr",
  Germany: "de",
  Sweden: "se",
  Italy: "it",
  Greece: "gr",
  Iceland: "is",
  Portugal: "pt",
  Malta: "mt",
  Norway: "no",
  Brazil: "br",
  Argentina: "ar",
  Colombia: "co",
  Peru: "pe",
  Venezuela: "ve",
  Uruguay: "uy",
};
