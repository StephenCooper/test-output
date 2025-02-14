const columnDefs = [
  { field: "athlete" },
  { field: "age", floatingFilter: true },
  { field: "country", suppressHeaderFilterButton: true },
  {
    field: "year",
    maxWidth: 120,
    floatingFilter: true,
    suppressHeaderFilterButton: true,
  },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total", filter: false },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
};

function openCountryFilter() {
  gridApi.showColumnFilter("country");
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
