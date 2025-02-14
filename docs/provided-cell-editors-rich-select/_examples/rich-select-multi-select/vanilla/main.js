const valueFormatter = (params) => {
  const { value } = params;
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
};

const valueParser = (params) => {
  const { newValue } = params;

  if (newValue == null || newValue === "") {
    return null;
  }

  if (Array.isArray(newValue)) {
    return newValue;
  }

  return params.newValue.split(",");
};

const columnDefs = [
  {
    headerName: "Multi Select",
    field: "colors",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      multiSelect: true,
      searchType: "matchAny",
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    },
  },
  {
    headerName: "Multi Select (No Pills)",
    field: "colors",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      suppressMultiSelectPillRenderer: true,
      multiSelect: true,
      searchType: "matchAny",
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    },
  },
  {
    headerName: "Multi Select (With Renderer)",
    field: "colors",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      cellRenderer: ColourCellRenderer,
      suppressMultiSelectPillRenderer: true,
      multiSelect: true,
      searchType: "matchAny",
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    },
  },
];

function getRandomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const numberOfOptions = getRandomNumber(1, 4);

  const selectedOptions = [];

  for (let i = 0; i < numberOfOptions; i++) {
    const color = colors[getRandomNumber(0, colors.length - 1)];
    if (selectedOptions.indexOf(color) === -1) {
      selectedOptions.push(color);
    }
  }

  selectedOptions.sort();

  return { colors: selectedOptions };
});

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    editable: true,
    valueFormatter: valueFormatter,
    valueParser: valueParser,
  },
  columnDefs: columnDefs,
  rowData: data,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
