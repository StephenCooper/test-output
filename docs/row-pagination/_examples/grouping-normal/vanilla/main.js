const columnDefs = [
  { field: "athlete" },
  { field: "age" },
  { field: "country", rowGroup: true },
  { field: "year", rowGroup: true },
  { field: "date" },
  { field: "sport", rowGroup: true },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],
  defaultColDef: {
    editable: true,
    filter: true,
    flex: 1,
    minWidth: 190,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
