let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "city", rowGroup: true },
    { field: "year" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    headerName: "Group",
    field: "athlete",
    minWidth: 220,
    cellRenderer: "agGroupCellRenderer",
  },
  rowData: getData(),

  // expand everything by default
  groupDefaultExpanded: -1,

  suppressAggFuncInHeader: true,
};

function onOptionChange() {
  const key = document.querySelector("#input-display-type").value;
  if (key === "true" || key === "false") {
    gridApi.setGridOption("groupHideParentOfSingleChild", key === "true");
  } else {
    gridApi.setGridOption("groupHideParentOfSingleChild", "leafGroupsOnly");
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
