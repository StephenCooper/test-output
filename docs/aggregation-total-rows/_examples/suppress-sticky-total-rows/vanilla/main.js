let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    minWidth: 300,
  },
  groupDefaultExpanded: -1,
  groupTotalRow: "bottom",
  grandTotalRow: "bottom",
};

function onChange() {
  const suppressStickyTotalRow = document.querySelector(
    "#input-property-value",
  ).value;
  if (
    suppressStickyTotalRow === "grand" ||
    suppressStickyTotalRow === "group"
  ) {
    gridApi.setGridOption("suppressStickyTotalRow", suppressStickyTotalRow);
  } else if (suppressStickyTotalRow === "true") {
    gridApi.setGridOption("suppressStickyTotalRow", true);
  } else {
    gridApi.setGridOption("suppressStickyTotalRow", false);
  }
}
// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
