let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "£A", field: "a", valueFormatter: currencyFormatter },
    { headerName: "£B", field: "b", valueFormatter: currencyFormatter },
    { headerName: "(A)", field: "a", valueFormatter: bracketsFormatter },
    { headerName: "(B)", field: "b", valueFormatter: bracketsFormatter },
  ],
  defaultColDef: {
    flex: 1,
    cellClass: "number-cell",
  },
  rowData: createRowData(),
};

function bracketsFormatter(params) {
  return "(" + params.value + ")";
}

function currencyFormatter(params) {
  return "£" + formatNumber(params.value);
}

function formatNumber(number) {
  return Math.floor(number).toLocaleString();
}

function createRowData() {
  const rowData = [];

  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(((i + 2) * 173456) % 10000),
      b: Math.floor(((i + 7) * 373456) % 10000),
    });
  }

  return rowData;
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
