const columnDefs = [
  {
    headerName: "Select Editor Without Max Height and Max Width",
    field: "color",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: colors,
    },
  },
  {
    headerName: "Select Editor With Max Height and Max Width",
    field: "color",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: colors,
      valueListMaxHeight: 200,
      valueListMaxWidth: 150,
    },
  },
];

function getRandomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return { color };
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
