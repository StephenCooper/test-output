const columnDefs = [
  { field: "athlete" },
  { field: "country" },
  { field: "sport" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
  },
  columnDefs: columnDefs,
  rowData: null,
  // no rows to pin to start with
  pinnedTopRowData: [
    {
      athlete: "TOP (athlete)",
      country: "TOP (country)",
      sport: "TOP (sport)",
    },
  ],
  pinnedBottomRowData: [
    {
      athlete: "BOTTOM (athlete)",
      country: "BOTTOM (country)",
      sport: "BOTTOM (sport)",
    },
  ],
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
