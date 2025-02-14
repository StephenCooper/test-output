let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],

  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
  },

  cellSelection: true,
  rowSelection: { mode: "multiRow" },

  sendToClipboard: sendToClipboard,
};

function sendToClipboard(params) {
  console.log("send to clipboard called with data:");
  console.log(params.data);
}

function onBtCopyRows() {
  gridApi.copySelectedRowsToClipboard();
}

function onBtCopyRange() {
  gridApi.copySelectedRangeToClipboard();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
