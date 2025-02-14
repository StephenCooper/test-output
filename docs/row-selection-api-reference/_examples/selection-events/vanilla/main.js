let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
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
  rowSelection: { mode: "multiRow", headerCheckbox: false },
  onRowSelected,
  onSelectionChanged,
};

function onRowSelected(event) {
  console.log(
    "row " + event.node.data.athlete + " selected = " + event.node.isSelected(),
  );
}

function onSelectionChanged(event) {
  const rowCount = event.api.getSelectedNodes().length;
  console.log("selection changed, " + rowCount + " rows selected");
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
