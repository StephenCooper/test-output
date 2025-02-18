const columnDefs = [
  { field: "athlete", suppressHeaderFilterButton: true, minWidth: 120 },
  {
    field: "age",
    sortable: false,
    headerComponentParams: {
      icon: "fa-user",
    },
  },
  { field: "country", suppressHeaderFilterButton: true, minWidth: 120 },
  { field: "year", sortable: false },
  { field: "date", suppressHeaderFilterButton: true },
  { field: "sport", sortable: false },
  {
    field: "gold",
    headerComponentParams: { icon: "fa-cog" },
    minWidth: 120,
  },
  { field: "silver", sortable: false },
  { field: "bronze", suppressHeaderFilterButton: true, minWidth: 120 },
  { field: "total", sortable: false },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
    headerComponentParams: {
      innerHeaderComponent: CustomInnerHeader,
    },
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
