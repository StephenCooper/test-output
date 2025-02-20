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
  getRowId: (params) => {
    return params.data.name;
  },
  groupDefaultExpanded: 1,
  rowBuffer: 100,
  masterDetail: true,
  detailCellRendererParams: {
    detailGridOptions: {
      columnDefs: [
        { field: "callId" },
        { field: "direction" },
        { field: "number", minWidth: 150 },
        { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
        { field: "switchCode", minWidth: 150 },
      ],
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.callRecords);
    },
  },
};

function onFirstDataRendered(params) {
  params.api.forEachNode(function (node) {
    node.setExpanded(true);
  });
}

function onBtExport() {
  const spreadsheets = [];

  const mainSheet = gridApi.getSheetDataForExcel();
  if (mainSheet) {
    spreadsheets.push(mainSheet);
  }

  gridApi.forEachDetailGridInfo(function (node) {
    const sheet = node.api.getSheetDataForExcel({
      sheetName: node.id.replace("detail_", ""),
    });
    if (sheet) {
      spreadsheets.push(sheet);
    }
  });

  gridApi.exportMultipleSheetsAsExcel({
    data: spreadsheets,
    fileName: "ag-grid.xlsx",
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
