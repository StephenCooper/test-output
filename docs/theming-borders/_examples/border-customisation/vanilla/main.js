const myTheme = agGrid.themeQuartz.withParams({
  borderColor: "#9696C8",
  wrapperBorder: false,
  headerRowBorder: false,
  rowBorder: { style: "dotted", width: 3 },
  columnBorder: { style: "dashed" },
});

let gridApi;

const gridOptions = {
  theme: myTheme,
  columnDefs: [
    { field: "athlete", minWidth: 170 },
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
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
