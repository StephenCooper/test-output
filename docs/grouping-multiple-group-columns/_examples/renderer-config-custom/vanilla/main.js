const columnDefs = [
  {
    field: "country",
    rowGroup: true,
    hide: true,
  },
  {
    field: "year",
    rowGroup: true,
    hide: true,
  },
  {
    field: "athlete",
  },
  {
    field: "total",
    aggFunc: "sum",
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  autoGroupColumnDef: {
    cellRenderer: CustomGroupCellRenderer,
  },
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  groupDefaultExpanded: 1,
  onCellDoubleClicked: (params) => {
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  },
  onCellKeyDown: (params) => {
    if (!("colDef" in params)) {
      return;
    }
    if (!(params.event instanceof KeyboardEvent)) {
      return;
    }
    if (params.event.code !== "Enter") {
      return;
    }
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  },
  groupDisplayType: "multipleColumns",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
