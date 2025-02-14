let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "athlete",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: {
              buttons: ["apply", "clear"],
            },
          },
          {
            filter: "agSetColumnFilter",
          },
        ],
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  },
};

function getTextModel() {
  gridApi.getColumnFilterInstance("athlete").then((multiFilterInstance) => {
    const textFilter = multiFilterInstance.getChildFilterInstance(0);
    console.log("Current Text Filter model: ", textFilter.getModel());
  });
}

function getSetMiniFilter() {
  gridApi.getColumnFilterInstance("athlete").then((multiFilterInstance) => {
    const setFilter = multiFilterInstance.getChildFilterInstance(1);
    console.log("Current Set Filter search text: ", setFilter.getMiniFilter());
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
