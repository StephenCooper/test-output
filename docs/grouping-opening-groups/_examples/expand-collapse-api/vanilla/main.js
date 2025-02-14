let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "athlete" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },

  getRowId: (params) => params.data.id,
  onFirstDataRendered: () => {
    const node = gridApi.getRowNode("2");
    if (node) {
      gridApi.setRowNodeExpanded(node, true, true);
    }
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) =>
      gridApi.setGridOption(
        "rowData",
        data.map((d, i) => ({ ...d, id: String(i) })),
      ),
    );
});
