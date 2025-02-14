let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "country",
      rowGroup: true,
      hide: true,
    },
    {
      headerName: "Range in Total",
      field: "total",
      aggFunc: (params) => {
        const values = params.values;
        return values.length > 0
          ? Math.max(...values) - Math.min(...values)
          : null;
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    field: "athlete",
    minWidth: 220,
  },
  suppressAggFuncInHeader: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
