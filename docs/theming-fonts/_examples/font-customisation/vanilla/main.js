const columnDefs = [
  { field: "athlete", minWidth: 170 },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "date" },
];

let gridApi;

const myTheme = agGrid.themeQuartz.withParams({
  fontFamily: "serif",
  headerFontFamily: "Brush Script MT",
  cellFontFamily: "monospace",
});

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
