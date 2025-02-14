let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "sport" },
    { field: "year", maxWidth: 120 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowSelection: { mode: "singleRow" },
  selectionColumnDef: {
    sortable: true,
    resizable: true,
    width: 100,
    suppressHeaderMenuButton: false,
    headerTooltip: "Checkboxes indicate selection",
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
