function getColumnDefs() {
  return [
    { field: "athlete", initialWidth: 100, initialSort: "asc" },
    { field: "age" },
    { field: "country", initialPinned: "left" },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
}

let gridApi;

const gridOptions = {
  defaultColDef: {
    initialWidth: 100,
  },
  columnDefs: getColumnDefs(),
};

function onBtWithDefault() {
  gridApi.setGridOption("columnDefs", getColumnDefs());
}

function onBtRemove() {
  gridApi.setGridOption("columnDefs", []);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
