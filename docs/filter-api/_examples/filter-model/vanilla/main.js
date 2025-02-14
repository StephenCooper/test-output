const filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }

    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }

    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

const columnDefs = [
  { field: "athlete", filter: "agTextColumnFilter" },
  { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
  { field: "country" },
  { field: "year", maxWidth: 100 },
  {
    field: "date",
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  { field: "sport" },
  { field: "gold", filter: "agNumberColumnFilter" },
  { field: "silver", filter: "agNumberColumnFilter" },
  { field: "bronze", filter: "agNumberColumnFilter" },
  { field: "total", filter: "agNumberColumnFilter" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  sideBar: "filters",
  onGridReady: (params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  },
};

let savedFilterModel = null;

function clearFilters() {
  gridApi.setFilterModel(null);
}

function saveFilterModel() {
  savedFilterModel = gridApi.getFilterModel();

  const keys = Object.keys(savedFilterModel);
  const savedFilters = keys.length > 0 ? keys.join(", ") : "(none)";

  document.querySelector("#savedFilters").textContent = savedFilters;
}

function restoreFilterModel() {
  gridApi.setFilterModel(savedFilterModel);
}

function restoreFromHardCoded() {
  const hardcodedFilter = {
    country: {
      type: "set",
      values: ["Ireland", "United States"],
    },
    age: { type: "lessThan", filter: "30" },
    athlete: { type: "startsWith", filter: "Mich" },
    date: { type: "lessThan", dateFrom: "2010-01-01" },
  };

  gridApi.setFilterModel(hardcodedFilter);
}

function destroyFilter() {
  gridApi.destroyFilter("athlete");
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
