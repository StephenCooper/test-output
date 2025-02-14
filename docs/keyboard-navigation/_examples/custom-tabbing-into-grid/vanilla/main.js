const columnDefs = [
  { headerName: "#", colId: "rowNum", valueGetter: "node.id" },
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
let lastFocused;

const focusGridInnerElement = (params) => {
  if (!lastFocused || !lastFocused.column) {
    return false;
  }

  if (lastFocused.rowIndex != null) {
    params.api.setFocusedCell(lastFocused.rowIndex, lastFocused.column);
  } else {
    params.api.setFocusedHeader(lastFocused.column);
  }

  return true;
};

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  onCellFocused: (params) => {
    lastFocused = { column: params.column, rowIndex: params.rowIndex };
  },
  onHeaderFocused: (params) => {
    lastFocused = { column: params.column, rowIndex: null };
  },
  focusGridInnerElement: focusGridInnerElement,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
