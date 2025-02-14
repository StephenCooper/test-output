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
    { headerName: "Brand", children: [{ field: "make" }, { field: "model" }] },
    {
      headerName: "Value",
      children: [{ field: "price" }],
    },
  ],

  rowData: [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ],

  onGridReady: (params) => {
    document.getElementById("columnGroups").checked = true;
  },
};

function getBoolean(id) {
  const field = document.querySelector("#" + id);

  return !!field.checked;
}

function getParams() {
  return {
    skipColumnGroupHeaders: getBoolean("columnGroups"),
    skipColumnHeaders: getBoolean("skipHeader"),
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
