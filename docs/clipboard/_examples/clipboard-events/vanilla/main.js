let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],

  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
  },

  cellSelection: true,

  onCellValueChanged: onCellValueChanged,
  onCutStart: onCutStart,
  onCutEnd: onCutEnd,
  onPasteStart: onPasteStart,
  onPasteEnd: onPasteEnd,
};

function onCellValueChanged(params) {
  console.log("Callback onCellValueChanged:", params);
}

function onCutStart(params) {
  console.log("Callback onCutStart:", params);
}

function onCutEnd(params) {
  console.log("Callback onCutEnd:", params);
}

function onPasteStart(params) {
  console.log("Callback onPasteStart:", params);
}

function onPasteEnd(params) {
  console.log("Callback onPasteEnd:", params);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
