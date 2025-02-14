const columnDefs = [
  {
    headerName: "Text Editor",
    field: "color1",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agTextCellEditor",
    cellEditorParams: {
      maxLength: 20,
    },
  },
  {
    headerName: "Select Editor",
    field: "color2",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: colors,
    },
  },
  {
    headerName: "Rich Select Editor",
    field: "color3",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      cellRenderer: ColourCellRenderer,
      filterList: true,
      searchType: "match",
      allowTyping: true,
      valueListMaxHeight: 220,
    },
  },
  {
    headerName: "Large Text Editor",
    field: "description",
    cellEditorPopup: true,
    cellEditor: "agLargeTextCellEditor",
    cellEditorParams: {
      maxLength: 250,
      rows: 10,
      cols: 50,
    },
    flex: 2,
  },
];

function getRandomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return {
    color1: color,
    color2: color,
    color3: color,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
