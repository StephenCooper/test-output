let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "athlete",
      rowGroup: true,
      hide: true,
      keyCreator: (params) => params.value.id,
      valueFormatter: (params) => params.value.name,
    },
    { field: "country" },
    { field: "year" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  rowData: getData(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
