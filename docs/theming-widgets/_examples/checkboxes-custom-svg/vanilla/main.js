const myTheme = agGrid.themeQuartz.withoutPart("checkboxStyle");

const columnDefs = [
  { field: "athlete", hide: true },
  { field: "age", hide: true },
  { field: "country", hide: true },
  { field: "year" },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  theme: myTheme,
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  sideBar: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
