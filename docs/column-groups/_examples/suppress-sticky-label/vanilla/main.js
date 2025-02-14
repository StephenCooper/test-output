const columnDefs = [
  {
    headerName: "Athlete Details",
    suppressStickyLabel: true,
    children: [
      { field: "athlete", pinned: true, colId: "athlete" },
      { field: "country", colId: "country" },
      { field: "age", colId: "age" },
    ],
  },
  {
    headerName: "Sports Results",
    suppressStickyLabel: true,
    openByDefault: true,
    children: [
      { field: "sport", colId: "sport" },
      { field: "gold", colId: "gold", columnGroupShow: "open" },
      { field: "silver", colId: "silver", columnGroupShow: "open" },
      { field: "bronze", colId: "bronze", columnGroupShow: "open" },
      { field: "total", colId: "total", columnGroupShow: "closed" },
    ],
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 200,
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
