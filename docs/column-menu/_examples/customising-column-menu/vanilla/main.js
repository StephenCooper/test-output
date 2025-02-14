const columnDefs = [
  {
    field: "athlete",
    minWidth: 200,
    filter: true,
    suppressHeaderMenuButton: true,
  },
  {
    field: "age",
    filter: true,
    floatingFilter: true,
    suppressHeaderMenuButton: true,
  },
  {
    field: "country",
    minWidth: 200,
    filter: true,
    suppressHeaderFilterButton: true,
  },
  {
    field: "year",
    filter: true,
    floatingFilter: true,
    suppressHeaderFilterButton: true,
  },
  { field: "sport", minWidth: 200, suppressHeaderContextMenu: true },
  {
    field: "gold",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    field: "silver",
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    field: "bronze",
    filter: true,
    floatingFilter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    field: "total",
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    suppressHeaderContextMenu: true,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
