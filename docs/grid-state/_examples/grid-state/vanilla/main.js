let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "athlete",
      minWidth: 150,
    },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  sideBar: true,
  pagination: true,
  rowSelection: { mode: "multiRow" },
  suppressColumnMoveAnimation: true,
  onGridPreDestroyed: onGridPreDestroyed,
  onStateUpdated: onStateUpdated,
};

function onGridPreDestroyed(event) {
  console.log("Grid state on destroy (can be persisted)", event.state);
}

function onStateUpdated(event) {
  console.log("State updated", event.state);
}

function reloadGrid() {
  const state = gridApi.getState();

  gridApi.destroy();

  const gridDiv = document.querySelector("#myGrid");

  gridOptions.initialState = state;

  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
}

function printState() {
  console.log("Grid state", gridApi.getState());
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
