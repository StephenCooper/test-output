let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "year" },
    { field: "sport" },
    { field: "total", rowGroup: true },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  groupRowRendererParams: {
    suppressCount: true,
    innerRenderer: CustomMedalCellRenderer,
  },
  groupDisplayType: "groupRows",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
