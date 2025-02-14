const columnDefs = [
  { field: "athlete", filter: "agTextColumnFilter" },
  {
    field: "gold",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
  {
    field: "silver",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
  {
    field: "bronze",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
  {
    field: "total",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
  },
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
