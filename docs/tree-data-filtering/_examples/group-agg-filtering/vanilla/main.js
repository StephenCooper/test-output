let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
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
  },
  autoGroupColumnDef: {
    headerName: "File Explorer",
    minWidth: 150,

    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true,
  groupDefaultExpanded: 1,
  suppressAggFilteredOnly: true,
  getDataPath: (data) => data.path,
  onGridReady: (event) => {
    gridApi.setFilterModel({
      size: {
        filterType: "number",
        type: "equal",
        filter: 5193728,
      },
    });
  },
};

function toggleCheckbox() {
  const checkbox = document.querySelector("#suppressAggFilteredOnly");
  gridApi.setGridOption("suppressAggFilteredOnly", checkbox.checked);
}

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
  // lookup the container we want the Grid to use
  const gridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
