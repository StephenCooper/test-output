const rowClassRules = {
  "red-row": 'data.color == "Red"',
  "green-row": 'data.color == "Green"',
  "blue-row": 'data.color == "Blue"',
};

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 80,
    filter: true,
  },
  rowClassRules: rowClassRules,
  rowData: getData(),
  rowDragManaged: true,
  columnDefs: [
    { cellRenderer: DragSourceRenderer, minWidth: 100 },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ],
};

function onDragOver(event) {
  const types = event.dataTransfer.types;

  const dragSupported = types.length;

  if (dragSupported) {
    event.dataTransfer.dropEffect = "move";
  }

  event.preventDefault();
}

function onDrop(event) {
  event.preventDefault();

  const textData = event.dataTransfer.getData("text/plain");
  const eJsonRow = document.createElement("div");
  eJsonRow.classList.add("json-row");
  eJsonRow.innerText = textData;

  const eJsonDisplay = document.querySelector("#eJsonDisplay");
  eJsonDisplay.appendChild(eJsonRow);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
