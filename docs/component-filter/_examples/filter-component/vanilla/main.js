const columnDefs = [
  { field: "row" },
  {
    field: "name",
    filter: PartialMatchFilter,
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  columnDefs: columnDefs,
  rowData: getData(),
};

function onClicked() {
  gridApi.getColumnFilterInstance("name").then((instance) => {
    instance.componentMethod("Hello World!");
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
