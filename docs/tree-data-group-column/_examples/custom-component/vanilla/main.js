const columnDefs = [
  { field: "created" },
  { field: "modified" },
  {
    field: "size",
    aggFunc: "sum",
    valueFormatter: (params) => {
      const sizeInKb = params.value / 1024;

      if (sizeInKb > 1024) {
        return `${+(sizeInKb / 1024).toFixed(2)} MB`;
      } else {
        return `${+sizeInKb.toFixed(2)} KB`;
      }
    },
  },
];

let gridApi;

const gridOptions = {
  treeData: true,
  getDataPath: (data) => data.path,
  columnDefs: columnDefs,
  autoGroupColumnDef: {
    cellRenderer: CustomGroupCellRenderer,
  },
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  groupDefaultExpanded: -1,
  rowData: getData(),
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
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
