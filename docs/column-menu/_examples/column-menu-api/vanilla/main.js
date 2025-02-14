const columnDefs = [
  { field: "athlete", minWidth: 200 },
  { field: "age" },
  { field: "country", minWidth: 200 },
  { field: "year" },
  { field: "sport", minWidth: 200 },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  onColumnMenuVisibleChanged: (event) => {
    console.log("columnMenuVisibleChanged", event);
  },
};

function showColumnChooser() {
  gridApi.showColumnChooser();
}

function showColumnFilter(colKey) {
  gridApi.showColumnFilter(colKey);
}

function showColumnMenu(colKey) {
  gridApi.showColumnMenu(colKey);
}

function hideColumnChooser() {
  gridApi.hideColumnChooser();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
