const columnDefs = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

function onSortChanged(e) {
  console.log("Event Sort Changed", e);
}

function onColumnResized(e) {
  console.log("Event agGrid.Column Resized", e);
}

function onColumnVisible(e) {
  console.log("Event agGrid.Column Visible", e);
}

function onColumnPivotChanged(e) {
  console.log("Event Pivot Changed", e);
}

function onColumnRowGroupChanged(e) {
  console.log("Event Row Group Changed", e);
}

function onColumnValueChanged(e) {
  console.log("Event Value Changed", e);
}

function onColumnMoved(e) {
  console.log("Event agGrid.Column Moved", e);
}

function onColumnPinned(e) {
  console.log("Event agGrid.Column Pinned", e);
}

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 150,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  // debug: true,
  columnDefs: columnDefs,
  onSortChanged: onSortChanged,
  onColumnResized: onColumnResized,
  onColumnVisible: onColumnVisible,
  onColumnPivotChanged: onColumnPivotChanged,
  onColumnRowGroupChanged: onColumnRowGroupChanged,
  onColumnValueChanged: onColumnValueChanged,
  onColumnMoved: onColumnMoved,
  onColumnPinned: onColumnPinned,
};

function onBtSortOn() {
  gridApi.applyColumnState({
    state: [
      { colId: "age", sort: "desc" },
      { colId: "athlete", sort: "asc" },
    ],
  });
}

function onBtSortOff() {
  gridApi.applyColumnState({
    defaultState: { sort: null },
  });
}

function onBtWidthNarrow() {
  gridApi.applyColumnState({
    state: [
      { colId: "age", width: 100 },
      { colId: "athlete", width: 100 },
    ],
  });
}

function onBtWidthNormal() {
  gridApi.applyColumnState({
    state: [
      { colId: "age", width: 200 },
      { colId: "athlete", width: 200 },
    ],
  });
}

function onBtHide() {
  gridApi.applyColumnState({
    state: [
      { colId: "age", hide: true },
      { colId: "athlete", hide: true },
    ],
  });
}

function onBtShow() {
  gridApi.applyColumnState({
    defaultState: { hide: false },
  });
}

function onBtPivotOn() {
  gridApi.setGridOption("pivotMode", true);
  gridApi.applyColumnState({
    state: [{ colId: "country", pivot: true }],
  });
}

function onBtPivotOff() {
  gridApi.setGridOption("pivotMode", false);
  gridApi.applyColumnState({
    defaultState: { pivot: false },
  });
}

function onBtRowGroupOn() {
  gridApi.applyColumnState({
    state: [{ colId: "sport", rowGroup: true }],
  });
}

function onBtRowGroupOff() {
  gridApi.applyColumnState({
    defaultState: { rowGroup: false },
  });
}

function onBtAggFuncOn() {
  gridApi.applyColumnState({
    state: [
      { colId: "gold", aggFunc: "sum" },
      { colId: "silver", aggFunc: "sum" },
      { colId: "bronze", aggFunc: "sum" },
    ],
  });
}

function onBtAggFuncOff() {
  gridApi.applyColumnState({
    defaultState: { aggFunc: null },
  });
}

function onBtNormalOrder() {
  gridApi.applyColumnState({
    state: [
      { colId: "athlete" },
      { colId: "age" },
      { colId: "country" },
      { colId: "sport" },
      { colId: "gold" },
      { colId: "silver" },
      { colId: "bronze" },
    ],
    applyOrder: true,
  });
}

function onBtReverseOrder() {
  gridApi.applyColumnState({
    state: [
      { colId: "athlete" },
      { colId: "age" },
      { colId: "country" },
      { colId: "sport" },
      { colId: "bronze" },
      { colId: "silver" },
      { colId: "gold" },
    ],
    applyOrder: true,
  });
}

function onBtPinnedOn() {
  gridApi.applyColumnState({
    state: [
      { colId: "athlete", pinned: "left" },
      { colId: "age", pinned: "right" },
    ],
  });
}

function onBtPinnedOff() {
  gridApi.applyColumnState({
    defaultState: { pinned: null },
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
