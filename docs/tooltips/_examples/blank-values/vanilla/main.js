const toolTipValueGetter = (params) =>
  params.value == null || params.value === "" ? "- Missing -" : params.value;

const columnDefs = [
  {
    headerName: "A - Missing Value, NO Tooltip",
    field: "athlete",
    tooltipField: "athlete",
  },
  {
    headerName: "B - Missing Value, WITH Tooltip",
    field: "athlete",
    tooltipValueGetter: toolTipValueGetter,
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  tooltipShowDelay: 500,
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      // set some blank values to test tooltip against
      data[0].athlete = undefined;
      data[1].athlete = null;
      data[2].athlete = "";
      gridApi.setGridOption("rowData", data);
    });
});
