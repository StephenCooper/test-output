let rowIdSequence = 100;

const columnDefs = [
  { field: "id", rowDrag: true },
  { field: "color" },
  { field: "value1" },
  { field: "value2" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    filter: true,
    flex: 1,
  },
  rowClassRules: {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  },
  rowData: createRowData(),
  rowDragManaged: true,
  columnDefs: columnDefs,
  onGridReady: (params) => {
    addDropZones(params);
    addCheckboxListener(params);
  },
};

function addCheckboxListener(params) {
  const checkbox = document.querySelector("input[type=checkbox]");

  checkbox.addEventListener("change", () => {
    params.api.setGridOption("suppressMoveWhenRowDragging", checkbox.checked);
  });
}

function createRowData() {
  const data = [];
  [
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
  ].forEach((color) => {
    const newDataItem = {
      id: rowIdSequence++,
      color: color,
      value1: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 100),
    };
    data.push(newDataItem);
  });
  return data;
}

function createTile(data) {
  const el = document.createElement("div");

  el.classList.add("tile");
  el.classList.add(data.color.toLowerCase());
  el.innerHTML =
    '<div class="id">' +
    data.id +
    "</div>" +
    '<div class="value">' +
    data.value1 +
    "</div>" +
    '<div class="value">' +
    data.value2 +
    "</div>";

  return el;
}

function addDropZones(params) {
  const tileContainer = document.querySelector(".tile-container");
  const dropZone = {
    getContainer: () => {
      return tileContainer;
    },
    onDragStop: (params) => {
      const tile = createTile(params.node.data);
      tileContainer.appendChild(tile);
    },
  };

  params.api.addRowDropZone(dropZone);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");

  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
