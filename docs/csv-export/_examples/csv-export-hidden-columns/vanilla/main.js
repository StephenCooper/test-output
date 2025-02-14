let gridApi;

const gridOptions = {
  defaultColDef: {
    editable: true,
    minWidth: 100,
    flex: 1,
  },

  suppressExcelExport: true,
  popupParent: document.body,

  columnDefs: [
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "gold", hide: true },
    { field: "silver", hide: true },
    { field: "bronze", hide: true },
    { field: "total" },
  ],

  rowData: getData(),
};

function getBoolean(id) {
  const field = document.querySelector("#" + id);

  return !!field.checked;
}

function getParams() {
  return {
    allColumns: getBoolean("allColumns"),
  };
}

function onBtnExport() {
  gridApi.exportDataAsCsv(getParams());
}

function onBtnUpdate() {
  document.querySelector("#csvResult").value =
    gridApi.getDataAsCsv(getParams());
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
