const columnDefs = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
};

function onBtSortAthlete() {
  gridApi.applyColumnState({
    state: [{ colId: "athlete", sort: "asc" }],
  });
}

function onBtClearAllSorting() {
  gridApi.applyColumnState({
    defaultState: { sort: null },
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
