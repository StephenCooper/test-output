const columnDefs = [
  { field: "athlete" },
  { field: "country" },
  {
    field: "date",
    minWidth: 190,
  },
  { field: "sport" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
  },
  columnDefs: columnDefs,
  rowData: null,
  components: {
    agDateInput: CustomDateComponent,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption(
        "rowData",
        data.map((row) => {
          const dateParts = row.date.split("/");
          const date = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0]),
          );
          return {
            ...row,
            date,
          };
        }),
      );
    });
});
