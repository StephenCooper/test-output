let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, enableRowGroup: true },
    { field: "sport", pivot: true, enablePivot: true },
    { field: "year", pivot: true, enablePivot: true },
    { field: "gold", aggFunc: "sum", enableValue: true },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 130,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  pivotMode: true,
  pivotPanelShow: "onlyWhenPivoting",

  sideBar: {
    defaultToolPanel: "columns",
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
    ],
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
