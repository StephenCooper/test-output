const columnDefs = [
  {
    lockPosition: "left",
    cellRenderer: ControlsCellRenderer,
    cellClass: "locked-col",
    width: 120,
    suppressNavigable: true,
  },
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    width: 150,
  },
  onColumnPinned: onColumnPinned,
  suppressDragLeaveHidesColumns: true,
};

function onColumnPinned(event) {
  const allCols = event.api.getAllGridColumns();

  if (event.pinned !== "right") {
    const allFixedCols = allCols.filter((col) => col.getColDef().lockPosition);
    event.api.setColumnsPinned(allFixedCols, event.pinned);
  }
}

function onPinAthleteLeft() {
  gridApi.applyColumnState({
    state: [{ colId: "athlete", pinned: "left" }],
  });
}
function onPinAthleteRight() {
  gridApi.applyColumnState({
    state: [{ colId: "athlete", pinned: "right" }],
  });
}

function onUnpinAthlete() {
  gridApi.applyColumnState({
    state: [{ colId: "athlete", pinned: null }],
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
