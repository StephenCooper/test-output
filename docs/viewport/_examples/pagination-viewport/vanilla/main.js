class RowIndexRenderer {
  eGui;
  init(params) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = "" + params.node.rowIndex;
  }
  refresh(params) {
    return false;
  }
  getGui() {
    return this.eGui;
  }
}

const columnDefs = [
  // this col shows the row index, doesn't use any data from the row
  {
    headerName: "#",
    maxWidth: 80,
    cellRenderer: RowIndexRenderer,
  },
  { field: "code", maxWidth: 90 },
  { field: "name", minWidth: 220 },
  {
    field: "bid",
    cellClass: "cell-number",
    valueFormatter: numberFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  {
    field: "mid",
    cellClass: "cell-number",
    valueFormatter: numberFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  {
    field: "ask",
    cellClass: "cell-number",
    valueFormatter: numberFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  {
    field: "volume",
    cellClass: "cell-number",
    cellRenderer: "agAnimateSlideCellRenderer",
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 140,
    sortable: false,
  },
  rowModelType: "viewport",
  pagination: true,
  paginationAutoPageSize: true,
  viewportRowModelPageSize: 1,
  viewportRowModelBufferSize: 0,
  // implement this so that we can do selection
  getRowId: (params) => {
    // the code is unique, so perfect for the id
    return params.data.code;
  },
  rowSelection: {
    mode: "multiRow",
    headerCheckbox: false,
  },
};

function numberFormatter(params) {
  if (typeof params.value === "number") {
    return params.value.toFixed(2);
  } else {
    return params.value;
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/stocks.json")
    .then((response) => response.json())
    .then(function (data) {
      // set up a mock server - real code will not do this, it will contact your
      // real server to get what it needs
      const mockServer = createMockServer();
      mockServer.init(data);

      const viewportDatasource = createViewportDatasource(mockServer);
      gridApi.setGridOption("viewportDatasource", viewportDatasource);
    });
});
