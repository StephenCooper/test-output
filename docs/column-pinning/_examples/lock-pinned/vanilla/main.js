const columnDefs = [
  {
    headerName: "Athlete (locked as pinned)",
    field: "athlete",
    width: 240,
    pinned: "left",
    lockPinned: true,
    cellClass: "lock-pinned",
  },
  {
    headerName: "Age (locked as not pinnable)",
    field: "age",
    width: 260,
    lockPinned: true,
    cellClass: "lock-pinned",
  },
  { field: "country", width: 150 },
  { field: "year", width: 90 },
  { field: "date", width: 150 },
  { field: "sport", width: 150 },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
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
