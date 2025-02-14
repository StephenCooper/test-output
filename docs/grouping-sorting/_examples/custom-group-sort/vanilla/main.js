let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "year", rowGroup: true },
    { field: "athlete" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 300,
    comparator: (valueA, valueB, nodeA, nodeB) =>
      (nodeA.allLeafChildren?.length ?? 0) -
      (nodeB.allLeafChildren?.length ?? 0),
  },
  groupDefaultExpanded: 1,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
