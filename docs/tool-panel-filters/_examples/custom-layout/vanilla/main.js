const columnDefs = [
  {
    headerName: "Athlete",
    children: [
      {
        headerName: "Name",
        field: "athlete",
        minWidth: 200,
        filter: "agTextColumnFilter",
      },
      { field: "age" },
      { field: "country", minWidth: 200 },
    ],
  },
  {
    headerName: "Competition",
    children: [{ field: "year" }, { field: "date", minWidth: 180 }],
  },
  { colId: "sport", field: "sport", minWidth: 200 },
  {
    headerName: "Medals",
    children: [
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ],
  },
];

const sortedToolPanelColumnDefs = [
  {
    headerName: "Athlete",
    children: [
      { field: "age" },
      { field: "country" },
      { headerName: "Name", field: "athlete" },
    ],
  },
  {
    headerName: "Competition",
    children: [{ field: "date" }, { field: "year" }],
  },
  {
    headerName: "Medals",
    children: [
      { field: "bronze" },
      { field: "gold" },
      { field: "silver" },
      { field: "total" },
    ],
  },
  { colId: "sport", field: "sport", width: 110 },
];

const customToolPanelColumnDefs = [
  {
    headerName: "Dummy Group 1",
    children: [
      { field: "age" },
      { headerName: "Name", field: "athlete" },
      {
        headerName: "Dummy Group 2",
        children: [{ colId: "sport" }, { field: "country" }],
      },
    ],
  },
  {
    headerName: "Medals",
    children: [
      { field: "total" },
      { field: "bronze" },
      {
        headerName: "Dummy Group 3",
        children: [{ field: "silver" }, { field: "gold" }],
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    filter: true,
  },
  columnDefs: columnDefs,
  sideBar: {
    toolPanels: [
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
        toolPanelParams: {
          suppressExpandAll: false,
          suppressFilterSearch: false,
          // prevents custom layout changing when columns are reordered in the grid
          suppressSyncLayoutWithGrid: true,
        },
      },
    ],
    defaultToolPanel: "filters",
  },
};

function setCustomSortLayout() {
  const filtersToolPanel = gridApi.getToolPanelInstance("filters");
  filtersToolPanel.setFilterLayout(sortedToolPanelColumnDefs);
}

function setCustomGroupLayout() {
  const filtersToolPanel = gridApi.getToolPanelInstance("filters");
  filtersToolPanel.setFilterLayout(customToolPanelColumnDefs);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
