let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", filter: true },
        { field: "age" },
        { field: "country", filter: true },
      ],
    },
    {
      headerName: "Medals",
      children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
    },
    { field: "total" },
  ],
  defaultColDef: {
    filter: false,
    minWidth: 100,
    flex: 1,
  },
  defaultExcelExportParams: {
    exportAsExcelTable: true,
  },
};

function onBtExport() {
  gridApi.exportDataAsExcel();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      gridApi.setGridOption("rowData", data);
    });
});
