const columnDefs = [
  {
    headerName: "Athlete Details",
    headerGroupComponentParams: {
      innerHeaderGroupComponent: CustomInnerHeaderGroup,
      icon: "fa-user",
    },
    children: [
      { field: "athlete", width: 150 },
      { field: "age", width: 90, columnGroupShow: "open" },
      {
        field: "country",
        width: 120,
        columnGroupShow: "open",
      },
    ],
  },
  {
    headerName: "Medal details",
    headerGroupComponentParams: {
      innerHeaderGroupComponent: CustomInnerHeaderGroup,
    },
    children: [
      { field: "year", width: 90 },
      { field: "date", width: 110 },
      {
        field: "sport",
        width: 110,
        columnGroupShow: "open",
      },
      {
        field: "gold",
        width: 100,
        columnGroupShow: "open",
      },
      {
        field: "silver",
        width: 100,
        columnGroupShow: "open",
      },
      {
        field: "bronze",
        width: 100,
        columnGroupShow: "open",
      },
      {
        field: "total",
        width: 100,
        columnGroupShow: "open",
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    width: 100,
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
