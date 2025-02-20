function formatNumber(number) {
  return Math.floor(number).toLocaleString();
}

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
  ],
  defaultColDef: {
    flex: 1,
    cellClass: "align-right",
    enableCellChangeFlash: true,
    valueFormatter: (params) => {
      return formatNumber(params.value);
    },
  },
  rowData: createRowData(),
};

function onUpdateSomeValues() {
  const rowCount = gridApi.getDisplayedRowCount();
  // pick 20 cells at random to update
  for (let i = 0; i < 20; i++) {
    const row = Math.floor(Math.random() * rowCount);
    const rowNode = gridApi.getDisplayedRowAtIndex(row);
    const col = ["a", "b", "c", "d", "e", "f"][i % 6];
    rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

function createRowData() {
  const rowData = [];

  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 25435) % 10000),
      b: Math.floor(((i + 323) * 23221) % 10000),
      c: Math.floor(((i + 323) * 468276) % 10000),
      d: 0,
      e: 0,
      f: 0,
    });
  }

  return rowData;
}
