let colorIndex = 0;
const colors = ["#99999944", "#CC333344", "#33CC3344", "#2244CC44"];

let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "C", field: "c" },
    { headerName: "D", field: "d" },
    { headerName: "E", field: "e" },
    { headerName: "F", field: "f" },
  ],
  defaultColDef: {
    flex: 1,
  },
  rowData: createData(12),
  getRowStyle: (params) => {
    return {
      backgroundColor: colors[colorIndex],
    };
  },
};

function createData(count) {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return result;
}

function progressColor() {
  colorIndex++;
  if (colorIndex === colors.length) {
    colorIndex = 0;
  }
}

function redrawAllRows() {
  progressColor();
  gridApi.redrawRows();
}

function redrawTopRows() {
  progressColor();
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const row = gridApi.getDisplayedRowAtIndex(i);
    rows.push(row);
  }
  gridApi.redrawRows({ rowNodes: rows });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
