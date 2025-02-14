let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, enableRowGroup: true },
    { field: "athlete", enablePivot: true },
    { field: "year", enablePivot: true },
    { field: "sport", enablePivot: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 130,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  pivotMode: true,
  sideBar: "columns",
  pivotMaxGeneratedColumns: 1000,
  onPivotMaxColumnsExceeded: () => {
    console.error(
      "The limit of 1000 generated columns has been exceeded. Either remove pivot or aggregations from some columns or increase the limit.",
    );
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
