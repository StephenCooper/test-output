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
    minWidth: 200,
  },
  autoGroupColumnDef: {
    cellRendererParams: {
      suppressCount: true,
    },
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params) => (params.value ? params.value.join("#") : null),
    },
  },
  treeData: true,
  groupDefaultExpanded: -1,
  getDataPath: (data) => data.path,
  rowData: getData(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
