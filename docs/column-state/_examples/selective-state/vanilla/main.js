const columnDefs = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 100,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  sideBar: {
    toolPanels: ["columns"],
  },
  rowGroupPanelShow: "always",
  pivotPanelShow: "always",
  // debug: true,
  columnDefs: columnDefs,
};

function onBtSaveSortState() {
  const allState = gridApi.getColumnState();
  const sortState = allState.map((state) => ({
    colId: state.colId,
    sort: state.sort,
    sortIndex: state.sortIndex,
  }));
  window.sortState = sortState;
  console.log("sort state saved", sortState);
}

function onBtRestoreSortState() {
  if (!window.sortState) {
    console.log("no sort state to restore, you must save sort state first");
    return;
  }
  gridApi.applyColumnState({
    state: window.sortState,
  });
  console.log("sort state restored");
}

function onBtSaveOrderAndVisibilityState() {
  const allState = gridApi.getColumnState();
  const orderAndVisibilityState = allState.map((state) => ({
    colId: state.colId,
    hide: state.hide,
  }));
  window.orderAndVisibilityState = orderAndVisibilityState;
  console.log("order and visibility state saved", orderAndVisibilityState);
}

function onBtRestoreOrderAndVisibilityState() {
  if (!window.orderAndVisibilityState) {
    console.log(
      "no order and visibility state to restore by, you must save order and visibility state first",
    );
    return;
  }
  gridApi.applyColumnState({
    state: window.orderAndVisibilityState,
    applyOrder: true,
  });
  console.log("column state restored");
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
