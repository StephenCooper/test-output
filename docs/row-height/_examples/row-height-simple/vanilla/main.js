let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "rowHeight" },
    { field: "athlete" },
    { field: "age", width: 80 },
    { field: "country" },
    { field: "year", width: 90 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    width: 150,
    filter: true,
  },
  // call back function, to tell the grid what height each row should be
  getRowHeight: getRowHeight,
};

function getRowHeight(params) {
  return params.data.rowHeight;
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      const differentHeights = [40, 80, 120, 200];
      data.forEach(function (dataItem, index) {
        dataItem.rowHeight = differentHeights[index % 4];
      });
      gridApi.setGridOption("rowData", data);
    });
});
