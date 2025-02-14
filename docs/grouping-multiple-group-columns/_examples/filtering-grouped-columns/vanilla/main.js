let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "country",
      rowGroup: true,
      hide: true,
      filter: "agTextColumnFilter",
    },
    { field: "year", rowGroup: true, hide: true, filter: true },
    { field: "athlete" },
    { field: "sport" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
    filter: "agGroupColumnFilter",
    floatingFilter: true,
  },
  groupDefaultExpanded: 1,
  groupDisplayType: "multipleColumns",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
