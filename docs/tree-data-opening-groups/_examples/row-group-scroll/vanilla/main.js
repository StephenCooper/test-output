let gridApi;

const gridOptions = {
  columnDefs: [
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
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  autoGroupColumnDef: {
    headerName: "File Explorer",
    minWidth: 280,
    filter: "agTextColumnFilter",

    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true,
  getDataPath: (data) => data.path,
  animateRows: false,
  onRowGroupOpened: onRowGroupOpened,
};

function onRowGroupOpened(event) {
  if (event.expanded) {
    const rowNodeIndex = event.node.rowIndex;
    // factor in child nodes so we can scroll to correct position
    const childCount = event.node.childrenAfterSort
      ? event.node.childrenAfterSort.length
      : 0;
    const newIndex = rowNodeIndex + childCount;
    gridApi.ensureIndexVisible(newIndex);
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
