let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "a",
      valueFormatter: valueFormatterA,
      valueGetter: valueGetterA,
      valueParser: valueParserA,
      valueSetter: valueSetterA,
      equals: equalsA,
      cellDataType: "object",
    },
    {
      field: "b",
      valueFormatter: valueFormatterB,
      valueParser: valueParserB,
      cellDataType: "object",
    },
  ],
  defaultColDef: {
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
};

function createValueA(value, data) {
  return value == null
    ? null
    : {
        actualValueA: value,
        anotherPropertyA: data.anotherPropertyA,
      };
}

function valueFormatterA(params) {
  // Convert complex object to string
  return params.value ? params.value.actualValueA : "";
}

function valueGetterA(params) {
  // Create complex object from underlying data
  return createValueA(params.data[params.colDef.field], params.data);
}

function valueParserA(params) {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterA`). `newValue` is string.
  // We have access to `data` (as well as `oldValue`) to retrieve any other properties we need to recreate the complex object.
  // For undo/redo to work, we need immutable data, so can't mutate `oldValue`
  return createValueA(params.newValue, params.data);
}

function valueSetterA(params) {
  // Update data from complex object (reverse of `valueGetterA`)
  params.data[params.colDef.field] = params.newValue
    ? params.newValue.actualValueA
    : null;
  return true;
}

function equalsA(valueA, valueB) {
  // Used to detect whether cell value has changed for refreshing. Needed as `valueGetter` returns different references.
  return (
    (valueA == null && valueB == null) ||
    (valueA != null &&
      valueB != null &&
      valueA.actualValueA === valueB.actualValueA)
  );
}

function createValueB(value, data) {
  return value == null
    ? null
    : {
        actualValueB: value,
        anotherPropertyB: data.anotherPropertyB,
      };
}

function valueFormatterB(params) {
  // Convert complex object to string
  return params.value ? params.value.actualValueB : "";
}

function valueParserB(params) {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterB`). `newValue` is string
  return createValueB(params.newValue, params.data);
}

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
  const undoSize = params.api.getCurrentUndoSize();
  setValue("#undoInput", undoSize);
  disable("#undoBtn", undoSize < 1);

  const redoSize = params.api.getCurrentRedoSize();
  setValue("#redoInput", redoSize);
  disable("#redoBtn", redoSize < 1);
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
      b: {
        actualValueB: "b-" + i,
        anotherPropertyB: "b",
      },
      anotherPropertyA: "a",
    };
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
