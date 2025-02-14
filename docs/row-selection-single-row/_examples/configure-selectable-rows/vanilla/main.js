let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "sport" },
    { field: "year", maxWidth: 120 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowSelection: {
    mode: "singleRow",
    hideDisabledCheckboxes: true,
    isRowSelectable: (rowNode) =>
      rowNode.data ? rowNode.data.year < 2007 : false,
  },
};

function toggleHideCheckbox() {
  gridApi.setGridOption("rowSelection", {
    mode: "singleRow",
    isRowSelectable: (rowNode) =>
      rowNode.data ? rowNode.data.year < 2007 : false,
    hideDisabledCheckboxes: getCheckboxValue("#toggle-hide-checkbox"),
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

function getCheckboxValue(id) {
  return document.querySelector(id)?.checked ?? false;
}
