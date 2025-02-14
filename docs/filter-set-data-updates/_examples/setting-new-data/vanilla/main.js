let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Set Filter Column",
      field: "col1",
      filter: "agSetColumnFilter",
      editable: true,
      minWidth: 250,
    },
  ],
  sideBar: "filters",
  rowData: getRowData(),
  onFirstDataRendered: onFirstDataRendered,
};

function getRowData() {
  return [{ col1: "A" }, { col1: "A" }, { col1: "B" }, { col1: "C" }];
}

function updateOne() {
  const newData = [
    { col1: "A" },
    { col1: "A" },
    { col1: "C" },
    { col1: "D" },
    { col1: "E" },
  ];
  gridApi.setGridOption("rowData", newData);
}

function updateTwo() {
  const newData = [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "C" },
    { col1: "D" },
    { col1: "E" },
    { col1: "B" },
    { col1: "B" },
  ];
  gridApi.setGridOption("rowData", newData);
}

function reset() {
  gridApi.setFilterModel(null);
  gridApi.setGridOption("rowData", getRowData());
}

function onFirstDataRendered(params) {
  params.api.getToolPanelInstance("filters").expandFilters();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
