const columnDefs = [
  { field: "athlete", minWidth: 170 },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  rowSelection: {
    mode: "singleRow",
    checkboxes: false,
  },
  onCellKeyDown: onCellKeyDown,
};

function onCellKeyDown(e) {
  console.log("onCellKeyDown", e);
  if (!e.event) {
    return;
  }

  const keyboardEvent = e.event;
  const key = keyboardEvent.key;

  if (key.length) {
    console.log("Key Pressed = " + key);
    if (key === "s") {
      const rowNode = e.node;
      const newSelection = !rowNode.isSelected();
      console.log(
        "setting selection on node " +
          rowNode.data.athlete +
          " to " +
          newSelection,
      );
      rowNode.setSelected(newSelection);
    }
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
