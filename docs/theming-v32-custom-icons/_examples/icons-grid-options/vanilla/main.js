const myIcons = {
  sortAscending: () => {
    return "ASC";
  },
  sortDescending: () => {
    return "DESC";
  },
};

const columnDefs = [
  {
    field: "athlete",
    rowGroup: true,
    hide: true,
  },
  {
    field: "age",
    width: 90,
    enableValue: true,
    icons: {
      // not very useful, but demonstrates you can just have strings
      sortAscending: "U",
      sortDescending: "D",
    },
  },
  {
    field: "country",
    width: 150,
    rowGroupIndex: 0,
    icons: {
      sortAscending: '<i class="fa fa-sort-alpha-up"/>',
      sortDescending: '<i class="fa fa-sort-alpha-down"/>',
    },
  },
  { field: "year", width: 90, enableRowGroup: true },
  { field: "date" },
  {
    field: "sport",
    width: 110,
    icons: myIcons,
  },
  { field: "gold", width: 100 },
  { field: "silver", width: 100 },
  { field: "bronze", width: 100 },
  { field: "total", width: 100 },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 150,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  columnDefs: columnDefs,
  sideBar: true,
  autoGroupColumnDef: {
    headerName: "Athlete",
    field: "athlete",
    rowDrag: true,
    // use font awesome for first col, with numbers for sort
    icons: {
      menu: '<i class="fa fa-shower"/>',
      menuAlt: '<i class="fa fa-shower"/>',
      filter: '<i class="fa fa-long-arrow-alt-up"/>',
      columns: '<i class="fa fa-snowflake"/>',
      sortAscending: '<i class="fa fa-sort-alpha-up"/>',
      sortDescending: '<i class="fa fa-sort-alpha-down"/>',
    },
    width: 300,
  },
  // override all the defaults with font awesome
  icons: {
    // use font awesome for menu icons
    menu: '<i class="fa fa-bath" style="width: 10px"/>',
    menuAlt: '<i class="fa fa-bath" style="width: 10px"/>',
    filter: '<i class="fa fa-long-arrow-alt-down"/>',
    columns: '<i class="fa fa-handshake"/>',
    sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
    sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
    // use some strings from group
    groupExpanded:
      '<img src="https://www.ag-grid.com/example-assets/group/contract.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
    groupContracted:
      '<img src="https://www.ag-grid.com/example-assets/group/expand.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
    columnMovePin: '<i class="far fa-hand-rock"/>',
    columnMoveAdd: '<i class="fa fa-plus-square"/>',
    columnMoveHide: '<i class="fa fa-times"/>',
    columnMoveMove: '<i class="fa fa-link"/>',
    columnMoveLeft: '<i class="fa fa-arrow-left"/>',
    columnMoveRight: '<i class="fa fa-arrow-right"/>',
    columnMoveGroup: '<i class="fa fa-users"/>',
    rowGroupPanel: '<i class="fa fa-university"/>',
    pivotPanel: '<i class="fa fa-magic"/>',
    valuePanel: '<i class="fa fa-magnet"/>',
    menuPin: "P", // just showing letters, no graphic
    menuValue: "V",
    menuAddRowGroup: "A",
    menuRemoveRowGroup: "R",
    clipboardCopy: ">>",
    clipboardCut: "<<",
    clipboardPaste: ">>",
    rowDrag: '<i class="fa fa-circle"/>',
    columnDrag: '<i class="fa fa-square"/>',
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
