let gridApi;

const gridOptions = {
  columnDefs: [{ field: "athlete" }, { field: "sport" }, { field: "age" }],
  enableCellTextSelection: true,
  ensureDomOrder: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
