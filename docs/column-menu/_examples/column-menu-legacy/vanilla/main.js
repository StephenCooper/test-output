const columnDefs = [
  { field: "athlete", minWidth: 200 },
  {
    field: "age",
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  },
  {
    field: "country",
    minWidth: 200,
    menuTabs: ["filterMenuTab", "columnsMenuTab"],
  },
  { field: "year", menuTabs: ["generalMenuTab"] },
  { field: "sport", minWidth: 200, menuTabs: [] },
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
  columnMenu: "legacy",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
