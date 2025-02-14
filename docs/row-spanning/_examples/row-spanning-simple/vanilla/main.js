const columnDefs = [
  { field: "country", spanRows: true, sort: "asc" },
  { field: "year", spanRows: true, sort: "asc" },
  { field: "sport", spanRows: true, sort: "asc" },
  { field: "athlete" },
  { field: "age" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
  },
  enableCellSpan: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
