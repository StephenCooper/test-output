let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "Athlete", field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
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
  },
  pagination: true,
  paginationAutoPageSize: true,
  rowSelection: {
    mode: "multiRow",
    selectAll: "all",
  },
};

function onQuickFilterChanged() {
  gridApi.setGridOption(
    "quickFilterText",
    document.querySelector("#quickFilter")?.value,
  );
}

function updateSelectAllMode() {
  const selectAll = document.querySelector("#select-all-mode")?.value ?? "all";

  gridApi.setGridOption("rowSelection", {
    mode: "multiRow",
    selectAll: selectAll,
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
