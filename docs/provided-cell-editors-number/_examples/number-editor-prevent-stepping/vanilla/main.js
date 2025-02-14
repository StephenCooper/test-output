const columnDefs = [
  {
    headerName: "Number Editor",
    field: "number",
    cellEditor: "agNumberCellEditor",
    cellEditorParams: {
      preventStepping: true,
    },
  },
];

const data = Array.from(Array(20).keys()).map((val, index) => ({
  number: index,
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
