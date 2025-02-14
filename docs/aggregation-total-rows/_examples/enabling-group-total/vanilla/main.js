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
  groupDefaultExpanded: 1,
  groupTotalRow: "bottom",
};

function onChange() {
  const groupTotalRow = document.querySelector("#input-property-value").value;
  if (groupTotalRow === "bottom" || groupTotalRow === "top") {
    gridApi.setGridOption("groupTotalRow", groupTotalRow);
  } else {
    gridApi.setGridOption("groupTotalRow", undefined);
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
