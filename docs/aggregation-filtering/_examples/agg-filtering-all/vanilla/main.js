let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year" },
    { field: "total", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ],
  defaultColDef: {
    flex: 1,
    floatingFilter: true,
  },
  autoGroupColumnDef: {
    field: "athlete",
  },
  groupDefaultExpanded: -1,
  groupAggFiltering: true,

  onGridReady: (params) => {
    document.querySelector("#groupAggFiltering").checked = true;
    params.api.setFilterModel({
      total: {
        type: "contains",
        filter: "192",
      },
    });
  },
};

function toggleProperty() {
  const enable = document.querySelector("#groupAggFiltering").checked;
  gridApi.setGridOption("groupAggFiltering", enable);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
