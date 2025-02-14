const colSpan = function (params) {
  return params.data === 2 ? 3 : 1;
};

const columnDefs = [
  {
    headerName: "A",
    field: "author",
    width: 300,
    colSpan: colSpan,
  },
  {
    headerName: "Flexed Columns",
    children: [
      {
        headerName: "B",
        minWidth: 200,
        maxWidth: 350,
        flex: 2,
      },
      {
        headerName: "C",
        flex: 1,
      },
    ],
  },
];

function fillAllCellsWithWidthMeasurement() {
  Array.prototype.slice
    .call(document.querySelectorAll(".ag-cell"))
    .forEach((cell) => {
      const width = cell.offsetWidth;
      const isFullWidthRow = cell.parentElement.childNodes.length === 1;
      cell.textContent = (isFullWidthRow ? "Total width: " : "") + width + "px";
    });
}

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  rowData: [1, 2],
  onGridReady: (params) => {
    setInterval(fillAllCellsWithWidthMeasurement, 50);
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
