const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

const columnDefs = [
  {
    field: "lorem",
    spanRows: true,
    wrapText: true,
    autoHeight: true,
    minWidth: 300,
  },
  { field: "athlete" },
  { field: "age" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
  },
  enableCellSpan: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((row, i) => {
        if (i % 3 === 0) {
          return;
        }
        row.lorem = lorem;
      });
      gridApi.setGridOption("rowData", data);
    });
});
