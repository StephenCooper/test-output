let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Aggregated (Sum)",
      aggFunc: "sum",
      field: "items",
    },
    {
      headerName: "Provided",
      field: "items",
    },
  ],
  defaultColDef: {
    flex: 1,
  },
  autoGroupColumnDef: {
    headerName: "Name",
    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true, // enable Tree Data mode
  groupDefaultExpanded: -1, // expand all groups by default
  getDataPath: (data) => data.path,
};

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
  // lookup the container we want the Grid to use
  const eGridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  gridApi = agGrid.createGrid(eGridDiv, gridOptions);
});
