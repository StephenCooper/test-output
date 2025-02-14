const columnDefs = [
  { field: "athlete", minWidth: 200 },
  { field: "age" },
  { field: "country", minWidth: 200 },
  { field: "year" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    minWidth: 100,
    filter: true,
  },
  suppressMenuHide: true,
  columnMenu: "legacy",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
