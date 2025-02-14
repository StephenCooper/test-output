let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "sport", pivot: true },
    {
      field: "gold",
      aggFunc: "sum",
      cellStyle: { backgroundColor: "#f2e287" },
    },
    { field: "silver", aggFunc: "sum", cellStyle: {} },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 130,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  pivotMode: true,
  processPivotResultColDef: (colDef) => {
    if (typeof colDef.cellStyle === "object") {
      colDef.cellStyle.color = "#2f73ff";
    }
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
