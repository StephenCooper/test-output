let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", enableRowGroup: true },
    { field: "year", enableRowGroup: true },
    { field: "athlete", minWidth: 180 },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  suppressDragLeaveHidesColumns: true,
  rowGroupPanelShow: "always",
};

function onPropertyChange() {
  const prop = document.querySelector("#visibility-behaviour").value;
  if (prop === "true" || prop === "false") {
    gridApi.setGridOption(
      "suppressGroupChangesColumnVisibility",
      prop === "true",
    );
  } else {
    gridApi.setGridOption("suppressGroupChangesColumnVisibility", prop);
  }
}

function resetCols() {
  gridApi.setGridOption("columnDefs", [
    { field: "country", enableRowGroup: true, hide: false },
    { field: "year", enableRowGroup: true, hide: false },
    { field: "athlete", minWidth: 180, hide: false },
    { field: "total", hide: false },
  ]);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
