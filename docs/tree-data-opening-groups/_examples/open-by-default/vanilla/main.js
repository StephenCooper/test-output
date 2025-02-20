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
  isGroupOpenByDefault: (params) => {
    return (
      (params.level === 0 && params.key === "Documents") ||
      (params.level === 1 && params.key === "Work") ||
      (params.level === 2 && params.key === "ProjectBeta")
    );
  },
  treeData: true,
  getDataPath: (data) => data.path,
  rowData: getData(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
