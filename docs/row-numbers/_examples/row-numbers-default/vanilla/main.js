const columnDefs = [
  { field: "athlete" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowNumbers: true,
  columnDefs: columnDefs,
  rowData: null,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
