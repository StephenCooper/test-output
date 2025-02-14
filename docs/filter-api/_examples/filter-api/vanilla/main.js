const columnDefs = [{ field: "athlete", filter: "agSetColumnFilter" }];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  sideBar: "filters",
  onGridReady: (params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  },
};

let savedMiniFilterText = "";

function getMiniFilterText() {
  gridApi.getColumnFilterInstance("athlete").then((athleteFilter) => {
    console.log(athleteFilter.getMiniFilter());
  });
}

function saveMiniFilterText() {
  gridApi.getColumnFilterInstance("athlete").then((athleteFilter) => {
    savedMiniFilterText = athleteFilter.getMiniFilter();
  });
}

function restoreMiniFilterText() {
  gridApi.getColumnFilterInstance("athlete").then((athleteFilter) => {
    athleteFilter.setMiniFilter(savedMiniFilterText);
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
