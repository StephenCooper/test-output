let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "total", rowGroup: true, cellRenderer: CustomMedalCellRenderer },
    { field: "year" },
    { field: "athlete" },
    { field: "sport" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    headerName: "Gold Medals",
    minWidth: 240,
    cellRendererParams: {
      suppressCount: true,
    },
  },
  // optional as 'singleColumn' is the default group display type
  groupDisplayType: "singleColumn",
  rowSelection: {
    mode: "singleRow",
    checkboxLocation: "autoGroupColumn",
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
