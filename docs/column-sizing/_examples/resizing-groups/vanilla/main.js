const columnDefs = [
  {
    headerName: "Everything Resizes",
    children: [
      {
        field: "athlete",
        headerClass: "resizable-header",
      },
      { field: "age", headerClass: "resizable-header" },
      {
        field: "country",
        headerClass: "resizable-header",
      },
    ],
  },
  {
    headerName: "Only Year Resizes",
    children: [
      { field: "year", headerClass: "resizable-header" },
      {
        field: "date",
        resizable: false,
        headerClass: "fixed-size-header",
      },
      {
        field: "sport",
        resizable: false,
        headerClass: "fixed-size-header",
      },
    ],
  },
  {
    headerName: "Nothing Resizes",
    children: [
      {
        field: "gold",
        resizable: false,
        headerClass: "fixed-size-header",
      },
      {
        field: "silver",
        resizable: false,
        headerClass: "fixed-size-header",
      },
      {
        field: "bronze",
        resizable: false,
        headerClass: "fixed-size-header",
      },
      {
        field: "total",
        resizable: false,
        headerClass: "fixed-size-header",
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 150,
  },
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
