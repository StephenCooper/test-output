const columnDefs = [
  {
    headerName: "Name & Country",
    headerTooltip: "Name & Country Group",
    children: [{ field: "athlete" }, { field: "country" }],
  },
  {
    headerName: "Sports Results",
    headerTooltip: "Sports Results Group",
    children: [
      { columnGroupShow: "closed", field: "total" },
      { columnGroupShow: "open", field: "gold" },
      { columnGroupShow: "open", field: "silver" },
      { columnGroupShow: "open", field: "bronze" },
    ],
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
