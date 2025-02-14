let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 200, filter: "agTextColumnFilter" },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 180 },
    { field: "gold", filter: false },
    { field: "silver", filter: false },
    { field: "bronze", filter: false },
    { field: "total", filter: false },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  sideBar: "filters",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
