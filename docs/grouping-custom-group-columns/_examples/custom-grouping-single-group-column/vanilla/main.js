let gridApi;

const gridOptions = {
  columnDefs: [
    // one column for showing the groups
    {
      headerName: "Group",
      cellRenderer: "agGroupCellRenderer",
      showRowGroup: true,
      minWidth: 210,
    },

    // the first group column
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },

    { field: "athlete" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
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
