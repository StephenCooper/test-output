let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "year" },
    { field: "gold", cellRenderer: MedalCellRenderer },
    { field: "silver", cellRenderer: MedalCellRenderer },
    { field: "bronze", cellRenderer: MedalCellRenderer },
    { cellRenderer: UpdateCellRenderer },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
