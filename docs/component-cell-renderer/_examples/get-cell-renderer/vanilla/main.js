const columnDefs = [
  { field: "athlete", width: 150 },
  { field: "country", width: 150 },
  { field: "year", width: 100 },
  { field: "gold", width: 100, cellRenderer: MedalCellRenderer },
  { field: "silver", width: 100, cellRenderer: MedalCellRenderer },
  { field: "bronze", width: 100, cellRenderer: MedalCellRenderer },
  {
    field: "total",
    editable: false,
    valueGetter: (params) =>
      params.data.gold + params.data.silver + params.data.bronze,
    width: 100,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
};

function onCallGold() {
  console.log("=========> calling all gold");
  // pass in list of columns, here it's gold only
  const params = { columns: ["gold"] };
  const instances = gridApi.getCellRendererInstances(params);
  instances.forEach((instance) => {
    instance.medalUserFunction();
  });
}

function onFirstRowGold() {
  console.log("=========> calling gold row one");
  // pass in one column and one row to identify one cell
  const firstRowNode = gridApi.getDisplayedRowAtIndex(0);
  const params = { columns: ["gold"], rowNodes: [firstRowNode] };

  const instances = gridApi.getCellRendererInstances(params);
  instances.forEach((instance) => {
    instance.medalUserFunction();
  });
}

function onCallAllCells() {
  console.log("=========> calling everything");
  // no params, goes through all rows and columns where cell renderer exists
  const instances = gridApi.getCellRendererInstances();
  instances.forEach((instance) => {
    instance.medalUserFunction();
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
