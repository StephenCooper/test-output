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
  groupTotalRow: (params) => {
    const node = params.node;
    if (node && node.level === 1) return "bottom";
    if (node && node.key === "United States") return "bottom";

    return undefined;
  },
  onFirstDataRendered: (params) => {
    params.api.forEachNode((node) => {
      if (node.key === "United States" || node.key === "Russia") {
        params.api.setRowNodeExpanded(node, true);
      }
    });
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data.slice(0, 50)));
});
