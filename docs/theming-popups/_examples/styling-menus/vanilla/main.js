// Set a blue background and red shadows for all menus
const myTheme = agGrid.themeQuartz.withParams({
  menuBackgroundColor: "cornflowerblue",
  menuShadow: { radius: 10, spread: 5, color: "red" },
});

const columnDefs = [
  { field: "athlete", minWidth: 170 },
  { field: "age", filter: "agNumberColumnFilter" },
  { field: "country" },
  { field: "year", filter: "agNumberColumnFilter" },
  { field: "date", filter: "agDateColumnFilter" },
  { field: "sport" },
  { field: "gold", filter: "agNumberColumnFilter" },
  { field: "silver", filter: "agNumberColumnFilter" },
  { field: "bronze", filter: "agNumberColumnFilter" },
  { field: "total", filter: "agNumberColumnFilter" },
];

let gridApi;

const gridOptions = {
  theme: myTheme,
  columnDefs: columnDefs,
  defaultColDef: {
    filter: true,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
