let lastGen = 0;
const generateItem = (id = lastGen++) => {
  return {
    id,
    sort: Math.floor(Math.random() * 3 + 2000),
    sort1: Math.floor(Math.random() * 3 + 2000),
    sort2: Math.floor(Math.random() * 100000 + 2000),
  };
};

const getRowData = (rows = 10) =>
  new Array(rows).fill(undefined).map((_) => generateItem());

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "id" },
    { field: "updatedBy" },
    { field: "sort", sortIndex: 0, sort: "desc" },
    { field: "sort1", sortIndex: 1, sort: "desc" },
    { field: "sort2", sortIndex: 2, sort: "desc" },
  ],
  defaultColDef: {
    flex: 1,
  },
  rowData: getRowData(100000),
  deltaSort: true,
  getRowId: ({ data }) => String(data.id),
};

function addDelta() {
  const transaction = {
    add: getRowData(1).map((row) => ({ ...row, updatedBy: "delta" })),
    update: [{ id: 1, make: "Delta", updatedBy: "delta" }],
  };
  gridApi.setGridOption("deltaSort", true);
  const startTime = new Date().getTime();
  gridApi.applyTransaction(transaction);
  document.getElementById("transactionDuration").textContent =
    `${new Date().getTime() - startTime} ms`;
}

function addDefault() {
  const transaction = {
    add: getRowData(1).map((row) => ({ ...row, updatedBy: "default" })),
    update: [{ id: 2, make: "Default", updatedBy: "default" }],
  };
  gridApi.setGridOption("deltaSort", false);
  const startTime = new Date().getTime();
  gridApi.applyTransaction(transaction);
  document.getElementById("transactionDuration").textContent =
    `${new Date().getTime() - startTime} ms`;
}

document.addEventListener("DOMContentLoaded", function () {
  const eGridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(eGridDiv, gridOptions);
});
