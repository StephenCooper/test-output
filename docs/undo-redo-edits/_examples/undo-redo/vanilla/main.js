let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
    { field: "g" },
    { field: "h" },
  ],
  defaultColDef: {
    flex: 1,
    editable: true,
    enableCellChangeFlash: true,
  },
  rowData: getRows(),
  cellSelection: {
    handle: {
      mode: "fill",
    },
  },
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 5,
  onFirstDataRendered: onFirstDataRendered,
  onCellValueChanged: onCellValueChanged,
  onUndoStarted: onUndoStarted,
  onUndoEnded: onUndoEnded,
  onRedoStarted: onRedoStarted,
  onRedoEnded: onRedoEnded,
};

function undo() {
  gridApi.undoCellEditing();
}

function redo() {
  gridApi.redoCellEditing();
}

function onFirstDataRendered() {
  setValue("#undoInput", 0);
  disable("#undoInput", true);
  disable("#undoBtn", true);

  setValue("#redoInput", 0);
  disable("#redoInput", true);
  disable("#redoBtn", true);
}

function onCellValueChanged(params) {
  console.log("cellValueChanged", params);

  const undoSize = params.api.getCurrentUndoSize();
  setValue("#undoInput", undoSize);
  disable("#undoBtn", undoSize < 1);

  const redoSize = params.api.getCurrentRedoSize();
  setValue("#redoInput", redoSize);
  disable("#redoBtn", redoSize < 1);
}

function onUndoStarted(event) {
  console.log("undoStarted", event);
}

function onUndoEnded(event) {
  console.log("undoEnded", event);
}

function onRedoStarted(event) {
  console.log("redoStarted", event);
}

function onRedoEnded(event) {
  console.log("redoEnded", event);
}

function disable(id, disabled) {
  document.querySelector(id).disabled = disabled;
}

function setValue(id, value) {
  document.querySelector(id).value = value;
}

function getRows() {
  return Array.apply(null, Array(100)).map(function (_, i) {
    return {
      a: "a-" + i,
      b: "b-" + i,
      c: "c-" + i,
      d: "d-" + i,
      e: "e-" + i,
      f: "f-" + i,
      g: "g-" + i,
      h: "h-" + i,
    };
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
