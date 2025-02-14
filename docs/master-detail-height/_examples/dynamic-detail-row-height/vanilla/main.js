let gridApi;

const gridOptions = {
  columnDefs: [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ],
  defaultColDef: {
    flex: 1,
  },
  masterDetail: true,
  detailCellRendererParams: {
    detailGridOptions: {
      columnDefs: [
        { field: "callId" },
        { field: "direction" },
        { field: "number" },
        { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
        { field: "switchCode" },
      ],
      defaultColDef: {
        flex: 1,
      },
      onGridReady: (params) => {
        // using auto height to fit the height of the the detail grid
        params.api.setGridOption("domLayout", "autoHeight");
      },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.callRecords);
    },
  },
  getRowHeight: (params) => {
    if (params.node && params.node.detail) {
      const offset = 80;
      const allDetailRowHeight =
        params.data.callRecords.length *
        params.api.getSizesForCurrentTheme().rowHeight;
      const gridSizes = params.api.getSizesForCurrentTheme();
      return (
        allDetailRowHeight +
        ((gridSizes && gridSizes.headerHeight) || 0) +
        offset
      );
    }
  },
  alwaysShowVerticalScroll: true,
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  // arbitrarily expand a row for presentational purposes
  setTimeout(() => {
    params.api.getDisplayedRowAtIndex(1).setExpanded(true);
  }, 0);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch(
    "https://www.ag-grid.com/example-assets/master-detail-dynamic-row-height-data.json",
  )
    .then((response) => response.json())
    .then(function (data) {
      gridApi.setGridOption("rowData", data);
    });
});
