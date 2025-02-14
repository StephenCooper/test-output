const columnDefs = [
  {
    headerName: "Checkbox Cell Editor",
    field: "boolean",
    cellEditor: "agCheckboxCellEditor",
  },
];

const data = Array.from(Array(20).keys()).map((val, index) => ({
  boolean: !!(index % 2),
}));

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 200,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: data,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
