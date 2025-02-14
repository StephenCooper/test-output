const columnDefs = [
  {
    headerName: "Athlete",
    children: [
      {
        field: "athlete",
        filter: "agTextColumnFilter",
        enableRowGroup: true,
        enablePivot: true,
        minWidth: 150,
      },
      { field: "age", enableRowGroup: true, enablePivot: true },
      {
        field: "country",
        enableRowGroup: true,
        enablePivot: true,
        minWidth: 125,
      },
    ],
  },
  {
    headerName: "Competition",
    children: [
      { field: "year", enableRowGroup: true, enablePivot: true },
      { field: "date", enableRowGroup: true, enablePivot: true, minWidth: 180 },
    ],
  },
  { field: "sport", enableRowGroup: true, enablePivot: true, minWidth: 125 },
  {
    headerName: "Medals",
    children: [
      { field: "gold", enableValue: true },
      { field: "silver", enableValue: true },
      { field: "bronze", enableValue: true },
      { field: "total", enableValue: true },
    ],
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  sideBar: "columns",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
