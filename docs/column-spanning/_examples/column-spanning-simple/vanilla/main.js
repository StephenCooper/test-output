const columnDefs = [
  { field: "athlete", pinned: "left" },
  { field: "age", pinned: "left" },
  {
    field: "country",
    colSpan: (params) => {
      const country = params.data.country;
      if (country === "Russia") {
        // have all Russia age columns width 2
        return 2;
      } else if (country === "United States") {
        // have all United States column width 4
        return 4;
      } else {
        // all other rows should be just normal
        return 1;
      }
    },
  },
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
    width: 150,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
