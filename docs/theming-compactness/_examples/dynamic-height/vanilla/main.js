function changeSize(value) {
  document.documentElement.style.setProperty("--ag-spacing", `${value}px`);
  document.getElementById("spacing").innerText = value.toFixed(1);
}

const columnDefs = [
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
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    filter: true,
  },
  sideBar: "columns",
  animateRows: false,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
