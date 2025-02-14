let gridApi;

const gridOptions = {
  loading: true,
  columnDefs: [{ field: "athlete" }, { field: "country" }],
};

function setLoading(value) {
  gridApi.setGridOption("loading", value);
}

function onBtnClearRowData() {
  gridApi.setGridOption("rowData", []);
}

function onBtnSetRowData() {
  gridApi.setGridOption("rowData", [
    { athlete: "Michael Phelps", country: "US" },
  ]);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
