let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "sport" },
    { field: "year", pivot: true },
    { field: "age" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    minWidth: 250,
  },
  pivotMode: true,
};

let applyBeforePivotOrAgg = false;

function onApplyBeforePivotOrAgg() {
  applyBeforePivotOrAgg = !applyBeforePivotOrAgg;
  gridApi.setGridOption(
    "applyQuickFilterBeforePivotOrAgg",
    applyBeforePivotOrAgg,
  );
  document.querySelector("#applyBeforePivotOrAgg").textContent =
    `Apply ${applyBeforePivotOrAgg ? "After" : "Before"} Pivot/Aggregation`;
}

function onFilterTextBoxChanged() {
  gridApi.setGridOption(
    "quickFilterText",
    document.getElementById("filter-text-box").value,
  );
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
