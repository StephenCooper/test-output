let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "firstName" },
    { field: "lastName" },
    { field: "gender" },
    { field: "age" },
    { field: "mood" },
    { field: "country" },
    { field: "address", minWidth: 550 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 110,
    editable: true,
  },
  rowData: getData(),
  pinnedTopRowData: getPinnedTopData(),
  pinnedBottomRowData: getPinnedBottomData(),
  onRowEditingStarted: (event) => {
    console.log("never called - not doing row editing");
  },
  onRowEditingStopped: (event) => {
    console.log("never called - not doing row editing");
  },
  onCellEditingStarted: (event) => {
    console.log("cellEditingStarted");
  },
  onCellEditingStopped: (event) => {
    console.log("cellEditingStopped");
  },
};

function getPinnedTopData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}

function getPinnedBottomData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}
function onBtStopEditing() {
  gridApi.stopEditing();
}

function onBtStartEditing(key, pinned) {
  gridApi.setFocusedCell(0, "lastName", pinned);

  gridApi.startEditingCell({
    rowIndex: 0,
    colKey: "lastName",
    // set to 'top', 'bottom' or undefined
    rowPinned: pinned,
    key: key,
  });
}

function onBtNextCell() {
  gridApi.tabToNextCell();
}

function onBtPreviousCell() {
  gridApi.tabToPreviousCell();
}

function onBtWhich() {
  const cellDefs = gridApi.getEditingCells();
  if (cellDefs.length > 0) {
    const cellDef = cellDefs[0];
    console.log(
      "editing cell is: row = " +
        cellDef.rowIndex +
        ", col = " +
        cellDef.column.getId() +
        ", floating = " +
        cellDef.rowPinned,
    );
  } else {
    console.log("no cells are editing");
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
