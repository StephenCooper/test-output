let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "Country", field: "country", rowGroup: true, hide: true },
    { headerName: "Year", field: "year", rowGroup: true, hide: true },
    { field: "athlete" },
    { field: "sport" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    headerValueGetter: (params) => `${params.colDef.headerName} Group Column`,
    minWidth: 220,
    cellRendererParams: {
      suppressCount: true,
    },
  },
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
