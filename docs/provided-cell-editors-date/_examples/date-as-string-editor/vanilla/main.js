const columnDefs = [
  {
    headerName: "Date as String Editor",
    field: "dateString",
    cellEditor: "agDateStringCellEditor",
  },
];

const data = Array.from(Array(20).keys()).map((val, index) => ({
  dateString: `2023-06-${index < 9 ? "0" + (index + 1) : index + 1}`,
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
