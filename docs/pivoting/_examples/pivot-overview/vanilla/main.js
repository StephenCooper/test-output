let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "sport", pivot: true },
    { field: "year", pivot: true },
    { field: "gold", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 130,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
    pinned: "left",
  },
  pivotMode: true,
  sideBar: "columns",
  pivotPanelShow: "always",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
