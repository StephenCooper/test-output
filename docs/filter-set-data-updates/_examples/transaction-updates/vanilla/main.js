let gridApi;

const gridOptions = {
  rowData: getRowData(),
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
  onFirstDataRendered: onFirstDataRendered,
};

function getRowData() {
  return [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "B" },
    { col1: "C" },
    { col1: "C" },
  ];
}

function updateFirstRow() {
  const firstRow = gridApi.getDisplayedRowAtIndex(0);
  if (firstRow) {
    const firstRowData = firstRow.data;
    firstRowData["col1"] += "X";
    gridApi.applyTransaction({ update: [firstRowData] });
  }
}

function addDRow() {
  gridApi.applyTransaction({ add: [{ col1: "D" }] });
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
