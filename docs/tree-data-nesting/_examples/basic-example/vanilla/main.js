let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "modified",
    },
    {
      field: "created",
    },
  ],
  defaultColDef: {
    flex: 1,
  },
  autoGroupColumnDef: {
    headerName: "Name",
    field: "name",
    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true, // enable Tree Data mode
  treeDataChildrenField: "children",
  groupDefaultExpanded: -1, // expand all groups by default
};

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
  // lookup the container we want the Grid to use
  const eGridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  gridApi = agGrid.createGrid(eGridDiv, gridOptions);
});
