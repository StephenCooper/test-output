const columnDefs = [
  { field: "athlete", width: 150 },
  { field: "country", width: 120 },
];

const rowData = [
  { athlete: "Michael Phelps", country: "United States" },
  { athlete: "Natalie Coughlin", country: "United States" },
  { athlete: "Aleksey Nemov", country: "Russia" },
  { athlete: "Alicia Coutts", country: "Australia" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },

  loading: true,

  columnDefs: columnDefs,
  rowData,

  loadingOverlayComponent: CustomLoadingOverlay,
  loadingOverlayComponentParams: {
    loadingMessage: "One moment please...",
  },
};

function setLoading(value) {
  gridApi.setGridOption("loading", value);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
