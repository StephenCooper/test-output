let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "bronze", aggFunc: "max" },
    { field: "silver", aggFunc: "max" },
    { field: "gold", aggFunc: "max" },
    { field: "total", aggFunc: "avg" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 140,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
};

function toggleProperty() {
  const suppressAggFuncInHeader = document.querySelector(
    "#suppressAggFuncInHeader",
  ).checked;
  gridApi.setGridOption("suppressAggFuncInHeader", suppressAggFuncInHeader);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
