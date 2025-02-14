let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year" },
    { field: "athlete" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
};

function toggleGroupAllowUnbalanced() {
  const enable = document.querySelector("#groupAllowUnbalanced").checked;
  gridApi.setGridOption("groupAllowUnbalanced", enable);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
