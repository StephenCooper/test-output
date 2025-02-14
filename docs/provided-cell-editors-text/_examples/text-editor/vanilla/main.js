const columnDefs = [
  {
    field: "color",
    cellEditor: "agTextCellEditor",
    cellEditorParams: {
      maxLength: 20,
    },
  },
  {
    field: "value",
    valueFormatter: (params) => `£ ${params.value}`,
    cellEditor: "agTextCellEditor",
    cellEditorParams: {
      maxLength: 20,
    },
  },
];

function getRandomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return {
    color: color,
    value: getRandomNumber(0, 1000),
  };
});

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
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
