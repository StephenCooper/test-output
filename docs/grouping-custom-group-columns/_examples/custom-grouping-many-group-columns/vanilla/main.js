const columnDefs = [
  {
    headerName: "Country Groups",
    minWidth: 200,
    showRowGroup: "country",
    cellRenderer: "agGroupCellRenderer",
  },
  {
    headerName: "Year Groups",
    minWidth: 200,
    showRowGroup: "year",
    cellRenderer: "agGroupCellRenderer",
  },
  { field: "country", rowGroup: true, hide: true },
  { field: "year", rowGroup: true, hide: true },

  { field: "athlete", minWidth: 220 },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  groupDisplayType: "custom",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
