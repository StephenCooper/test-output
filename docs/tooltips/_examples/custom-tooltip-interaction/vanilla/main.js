const columnDefs = [
  {
    field: "athlete",
    minWidth: 150,
    tooltipField: "athlete",
    tooltipComponentParams: { type: "success" },
  },
  { field: "age", minWidth: 130, tooltipField: "age" },
  { field: "year" },
  { field: "sport" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    tooltipComponent: CustomTooltip,
  },

  tooltipInteraction: true,
  tooltipShowDelay: 500,
  // set rowData to null or undefined to show loading panel by default
  rowData: null,
  columnDefs: columnDefs,
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
