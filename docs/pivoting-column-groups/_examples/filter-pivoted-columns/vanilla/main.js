let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, filter: true },
    { field: "sport", pivot: true, filter: true },
    { field: "gold", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  pivotMode: true,
  sideBar: "filters",
  onGridReady: (params) => {
    const filtersToolPanel = params.api.getToolPanelInstance("filters");
    if (filtersToolPanel) {
      // expands 'year' and 'sport' filters in the Filters Tool Panel
      filtersToolPanel.expandFilters(["sport"]);
    }
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
