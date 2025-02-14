const filterParams = {
  filterOptions: ["greaterThan"],
  maxNumConditions: 1,
};

const columnDefs = [
  { field: "athlete", filter: false },
  {
    field: "gold",
    filter: "agNumberColumnFilter",
    filterParams: filterParams,
    floatingFilterComponent: SliderFloatingFilter,
    floatingFilterComponentParams: {
      maxValue: 7,
    },
    suppressFloatingFilterButton: true,
    suppressHeaderMenuButton: false,
  },
  {
    field: "silver",
    filter: "agNumberColumnFilter",
    filterParams: filterParams,
    floatingFilterComponent: SliderFloatingFilter,
    floatingFilterComponentParams: {
      maxValue: 5,
    },
    suppressFloatingFilterButton: true,
    suppressHeaderMenuButton: false,
  },
  {
    field: "bronze",
    filter: "agNumberColumnFilter",
    filterParams: filterParams,
    floatingFilterComponent: SliderFloatingFilter,
    floatingFilterComponentParams: {
      maxValue: 10,
    },
    suppressFloatingFilterButton: true,
    suppressHeaderMenuButton: false,
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
  alwaysShowVerticalScroll: true,
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
