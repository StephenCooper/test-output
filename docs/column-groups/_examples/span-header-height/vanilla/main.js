const columnDefs = [
  {
    headerName: "Athlete Details",
    children: [{ field: "athlete" }, { field: "country" }],
  },
  {
    field: "age",
    width: 90,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
