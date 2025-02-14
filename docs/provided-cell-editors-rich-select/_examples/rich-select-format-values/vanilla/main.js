const languages = ["English", "Spanish", "French", "Portuguese", "(other)"];

function getRandomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const columnDefs = [
  {
    headerName: "Rich Select Editor",
    field: "language",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: languages,
      formatValue: (values) => values.toUpperCase(),
    },
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 200,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: new Array(100)
    .fill(null)
    .map(() => ({ language: languages[getRandomNumber(0, 4)] })),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
