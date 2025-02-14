let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Athlete details",
      children: [
        { field: "athlete", minWidth: 200 },
        { field: "country", minWidth: 150 },
        { field: "sport", minWidth: 150 },
      ],
    },
    {
      headerName: "Medal results",
      children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
    },
  ],

  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  popupParent: document.body,
};

const getParams = () => ({
  processHeaderCallback(params) {
    return `header: ${params.api.getDisplayNameForColumn(params.column, null)}`;
  },
  processGroupHeaderCallback(params) {
    return `group header: ${params.api.getDisplayNameForColumnGroup(params.columnGroup, null)}`;
  },
});

function onBtExport() {
  gridApi.exportDataAsExcel(getParams());
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) =>
      gridApi.setGridOption(
        "rowData",
        data.filter((rec) => rec.country != null),
      ),
    );
});
