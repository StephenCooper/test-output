let gridApi;

const gridOptions = {
  columnDefs: [
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
  ],
  defaultColDef: {
    width: 150,
  },
  suppressDragLeaveHidesColumns: true,
};

function onMedalsFirst() {
  gridApi.moveColumns(["gold", "silver", "bronze", "total"], 0);
}

function onMedalsLast() {
  gridApi.moveColumns(["gold", "silver", "bronze", "total"], 6);
}

function onCountryFirst() {
  gridApi.moveColumns(["country"], 0);
}

function onSwapFirstTwo() {
  gridApi.moveColumnByIndex(0, 1);
}

function onPrintColumns() {
  const cols = gridApi.getAllGridColumns();
  const colToNameFunc = (col, index) => index + " = " + col.getId();
  const colNames = cols.map(colToNameFunc).join(", ");
  console.log("columns are: " + colNames);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
