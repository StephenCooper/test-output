const columnDefs = [
  { field: "athlete", width: 150 },
  { field: "country", width: 120 },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },

  columnDefs: columnDefs,
  rowData: [],

  noRowsOverlayComponent: CustomNoRowsOverlay,
  noRowsOverlayComponentParams: {
    noRowsMessageFunc: () =>
      "No rows found at: " + new Date().toLocaleTimeString(),
  },
};

function onBtnClearRowData() {
  gridApi.setGridOption("rowData", []);
}

function onBtnSetRowData() {
  gridApi.setGridOption("rowData", [
    { athlete: "Michael Phelps", country: "US" },
  ]);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
