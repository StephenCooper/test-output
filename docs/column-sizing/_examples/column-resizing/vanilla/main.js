const columnDefs = [
  { field: "athlete", width: 150, suppressSizeToFit: true },
  {
    field: "age",
    headerName: "Age of Athlete",
    width: 90,
    minWidth: 50,
    maxWidth: 150,
  },
  { field: "country", width: 120 },
  { field: "year", width: 90 },
  { field: "date", width: 110 },
  { field: "sport", width: 110 },
  { field: "gold", width: 100 },
  { field: "silver", width: 100 },
  { field: "bronze", width: 100 },
  { field: "total", width: 100 },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  onColumnResized: (params) => {
    console.log(params);
  },
  autoSizeStrategy: {
    type: "fitCellContents",
  },
};

function autoSizeAll(skipHeader) {
  const allColumnIds = [];
  gridApi.getColumns().forEach((column) => {
    allColumnIds.push(column.getId());
  });

  gridApi.autoSizeColumns(allColumnIds, skipHeader);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
