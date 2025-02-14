const columnDefs = [
  {
    field: "athlete",
    cellClass: "custom-athlete-cell",
    cellRenderer: CustomCellRenderer,
  },
  { field: "country" },
  { field: "year", width: 100 },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 170,
    filter: true,
  },
  rowDragManaged: true,
  columnDefs: columnDefs,
  onRowDragEnter: onRowDragEnter,
  onRowDragEnd: onRowDragEnd,
  onRowDragCancel: onRowDragCancel,
};

function onRowDragEnter(e) {
  console.log("onRowDragEnter", e);
}

function onRowDragEnd(e) {
  console.log("onRowDragEnd", e);
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
