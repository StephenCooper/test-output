const columnDefinitions = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
];

const updatedHeaderColumnDefs = [
  { field: "athlete", headerName: "C1" },
  { field: "age", headerName: "C2" },
  { field: "country", headerName: "C3" },
  { field: "sport", headerName: "C4" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefinitions,
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
};

function onBtUpdateHeaders() {
  gridApi.setGridOption("columnDefs", updatedHeaderColumnDefs);
}

function onBtRestoreHeaders() {
  gridApi.setGridOption("columnDefs", columnDefinitions);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
