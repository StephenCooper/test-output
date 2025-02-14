const columnDefs = [
  { field: "athlete" },
  { field: "age", width: 100 },
  { field: "country" },
  { field: "year", width: 100 },
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
    width: 170,
  },
  multiSortKey: "ctrl",
  onGridReady: (params) => {
    const defaultSortModel = [
      { colId: "country", sort: "asc", sortIndex: 0 },
      { colId: "athlete", sort: "asc", sortIndex: 1 },
    ];

    params.api.applyColumnState({ state: defaultSortModel });
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
