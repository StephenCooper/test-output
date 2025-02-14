let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 300 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 200 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowSelection: { mode: "multiRow" },
  selectionColumnDef: {
    sortable: true,
    resizable: true,
    width: 120,
    suppressHeaderMenuButton: false,
    pinned: "left",
  },
  onFirstDataRendered: (params) => {
    const nodesToSelect = [];
    params.api.forEachNode((node) => {
      if (node.rowIndex && node.rowIndex >= 3 && node.rowIndex <= 8) {
        nodesToSelect.push(node);
      }
    });
    params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
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
