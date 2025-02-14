let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", rowDrag: true },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ],
  defaultColDef: {
    width: 170,
    filter: true,
  },
  onRowDragEnter: onRowDragEnter,
  onRowDragEnd: onRowDragEnd,
  onRowDragMove: onRowDragMove,
  onRowDragLeave: onRowDragLeave,
  onRowDragCancel: onRowDragCancel,
};

function onRowDragEnter(e) {
  console.log("onRowDragEnter", e);
}

function onRowDragEnd(e) {
  console.log("onRowDragEnd", e);
}

function onRowDragMove(e) {
  console.log("onRowDragMove", e);
}

function onRowDragLeave(e) {
  console.log("onRowDragLeave", e);
}

function onRowDragCancel(e) {
  console.log("onRowDragCancel", e);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
