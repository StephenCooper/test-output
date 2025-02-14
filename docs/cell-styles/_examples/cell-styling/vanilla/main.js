const ragCellClassRules = {
  "rag-green-outer": (params) => params.value === 2008,
  "rag-blue-outer": (params) => params.value === 2004,
  "rag-red-outer": (params) => params.value === 2000,
};

const columnDefs = [
  { field: "athlete" },
  {
    field: "age",
    maxWidth: 90,
    valueParser: numberParser,
    cellClassRules: {
      "rag-green": "x < 20",
      "rag-blue": "x >= 20 && x < 25",
      "rag-red": "x >= 25",
    },
  },
  { field: "country" },
  {
    field: "year",
    maxWidth: 90,
    valueParser: numberParser,
    cellClassRules: ragCellClassRules,
    cellRenderer: ragRenderer,
  },
  { field: "date", cellClass: "rag-blue" },
  {
    field: "sport",
    cellClass: cellClass,
  },
  {
    field: "gold",
    valueParser: numberParser,
    cellStyle: {
      // you can use either came case or dashes, the grid converts to whats needed
      backgroundColor: "#aaffaa", // light green
    },
  },
  {
    field: "silver",
    valueParser: numberParser,
    // when cellStyle is a func, we can have the style change
    // dependent on the data, eg different colors for different values
    cellStyle: cellStyle,
  },
  {
    field: "bronze",
    valueParser: numberParser,
    // same as above, but demonstrating dashes in the style, grid takes care of converting to/from camel case
    cellStyle: cellStyle,
  },
];

function cellStyle(params) {
  const color = numberToColor(params.value);
  return {
    backgroundColor: color,
  };
}

function cellClass(params) {
  return params.value === "Swimming" ? "rag-green" : "rag-blue";
}

function numberToColor(val) {
  if (val === 0) {
    return "#ffaaaa";
  } else if (val == 1) {
    return "#aaaaff";
  } else {
    return "#aaffaa";
  }
}

function ragRenderer(params) {
  return '<span class="rag-element">' + params.value + "</span>";
}

function numberParser(params) {
  const newValue = params.newValue;
  let valueAsNumber;
  if (newValue === null || newValue === undefined || newValue === "") {
    valueAsNumber = null;
  } else {
    valueAsNumber = parseFloat(params.newValue);
  }
  return valueAsNumber;
}

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    editable: true,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
