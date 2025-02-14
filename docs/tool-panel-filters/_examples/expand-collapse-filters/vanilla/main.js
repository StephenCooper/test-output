const columnDefs = [
  {
    groupId: "athleteGroupId",
    headerName: "Athlete",
    children: [
      {
        headerName: "Name",
        field: "athlete",
        minWidth: 200,
        filter: "agTextColumnFilter",
      },
      { field: "age" },
      {
        groupId: "competitionGroupId",
        headerName: "Competition",
        children: [{ field: "year" }, { field: "date", minWidth: 180 }],
      },
      { field: "country", minWidth: 200 },
    ],
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

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  sideBar: "filters",
};

function collapseAll() {
  gridApi.getToolPanelInstance("filters").collapseFilters();
}

function expandYearAndSport() {
  gridApi.getToolPanelInstance("filters").expandFilters(["year", "sport"]);
}

function collapseYear() {
  gridApi.getToolPanelInstance("filters").collapseFilters(["year"]);
}

function expandAll() {
  gridApi.getToolPanelInstance("filters").expandFilters();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
