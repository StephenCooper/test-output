const columnDefs = [
  { field: "athlete", width: 150 },
  { field: "age", width: 90 },
  { field: "country", width: 150 },
  { field: "year", width: 90 },
  { field: "date", width: 110 },
  { field: "sport", width: 150 },
  { field: "gold", width: 100 },
  { field: "silver", width: 100 },
  { field: "bronze", width: 100 },
  { field: "total", width: 100 },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  colResizeDefault: "shift",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
