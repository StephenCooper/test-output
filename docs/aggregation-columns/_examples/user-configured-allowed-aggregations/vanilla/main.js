let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    {
      headerName: "First or Last",
      field: "total",
      aggFunc: "first",
      allowedAggFuncs: ["first", "last"],
      enableValue: true,
    },
    {
      headerName: "Min or Max",
      field: "total",
      aggFunc: "min",
      allowedAggFuncs: ["min", "max"],
      enableValue: true,
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  sideBar: "columns",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
