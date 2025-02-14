let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "bronze", aggFunc: "sum" },
    { field: "silver", aggFunc: "2x+1" },
    { field: "gold", aggFunc: "avg" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  grandTotalRow: "bottom",
  groupTotalRow: "bottom",
  aggFuncs: {
    "2x+1": (params) => {
      const value = params.values[0];
      return 2 * value + 1;
    },
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
