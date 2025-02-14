let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    headerName: "Athlete",
    field: "athlete",
    minWidth: 250,
    cellRenderer: "agGroupCellRenderer",
  },
  rowSelection: {
    mode: "multiRow",
    groupSelects: "self",
  },
  suppressAggFuncInHeader: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});

function getGroupSelectsValue() {
  return document.querySelector("#input-group-selection-mode")?.value ?? "self";
}

function onSelectionModeChange() {
  gridApi.setGridOption("rowSelection", {
    mode: "multiRow",
    groupSelects: getGroupSelectsValue(),
  });
}

function onQuickFilterChanged() {
  gridApi.setGridOption(
    "quickFilterText",
    document.querySelector("#input-quick-filter")?.value,
  );
}
