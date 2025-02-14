// Create a dummy locale based on english but prefix everything with zzz
const AG_GRID_LOCALE_ZZZ = zzzLocale(AG_GRID_LOCALE_DE);

class NodeIdRenderer {
  eGui;

  init(params) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = params.node.id + 1;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}

const columnDefs = [
  // this row just shows the row index, doesn't use any data from the row
  {
    headerName: "#",
    cellRenderer: NodeIdRenderer,
  },
  { field: "athlete", filterParams: { buttons: ["clear", "reset", "apply"] } },
  {
    field: "age",
    filterParams: { buttons: ["apply", "cancel"] },
    enablePivot: true,
  },
  { field: "country", enableRowGroup: true },
  { field: "year", filter: "agNumberColumnFilter" },
  { field: "date" },
  {
    field: "sport",
    filter: "agMultiColumnFilter",
    filterParams: {
      filters: [
        {
          filter: "agTextColumnFilter",
          display: "accordion",
        },
        {
          filter: "agSetColumnFilter",
          display: "accordion",
        },
      ],
    },
  },
  { field: "gold", enableValue: true },
  { field: "silver", enableValue: true },
  { field: "bronze", enableValue: true },
  { field: "total", enableValue: true },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  sideBar: true,
  statusBar: {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
      { statusPanel: "agAggregationComponent" },
    ],
  },
  rowGroupPanelShow: "always",
  pagination: true,
  paginationPageSize: 500,
  paginationPageSizeSelector: [100, 500, 1000],
  enableCharts: true,
  localeText: AG_GRID_LOCALE_ZZZ,
  rowSelection: { mode: "multiRow" },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
