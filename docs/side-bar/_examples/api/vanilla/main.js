let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", filter: "agTextColumnFilter", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 160 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    filter: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  sideBar: {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
      },
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
      },
    ],
    defaultToolPanel: "filters",
    hiddenByDefault: true,
  },
  onToolPanelVisibleChanged: (event) => {
    console.log("toolPanelVisibleChanged", event);
  },
  onToolPanelSizeChanged: (event) => {
    console.log("toolPanelSizeChanged", event);
  },
};

function setSideBarVisible(value) {
  gridApi.setSideBarVisible(value);
}

function isSideBarVisible() {
  alert(gridApi.isSideBarVisible());
}

function openToolPanel(key) {
  gridApi.openToolPanel(key);
}

function closeToolPanel() {
  gridApi.closeToolPanel();
}

function getOpenedToolPanel() {
  alert(gridApi.getOpenedToolPanel());
}

function setSideBar(def) {
  gridApi.setGridOption("sideBar", def);
}

function getSideBar() {
  const sideBar = gridApi.getSideBar();
  alert(JSON.stringify(sideBar));
  console.log(sideBar);
}

function setSideBarPosition(position) {
  gridApi.setSideBarPosition(position);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
