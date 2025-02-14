let gridApi;

const gridOptions = {
  columnDefs: [{ field: "employeeId" }],
  defaultColDef: {
    flex: 1,
  },
  autoGroupColumnDef: {
    headerName: "Organisation Chart",
    field: "name",

    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true,
  groupDefaultExpanded: 1,
  getDataPath: (data) => data.path,
};

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
  // lookup the container we want the Grid to use
  const gridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
