const columnDefs = [
  {
    headerName: "Athlete Details",
    headerStyle: { color: "white", backgroundColor: "cadetblue" },
    children: [
      {
        field: "athlete",
        headerStyle: { color: "white", backgroundColor: "teal" },
      },
      { field: "age", initialWidth: 120 },
      {
        field: "country",
        headerStyle: (params) => {
          return {
            color: "white",
            backgroundColor: params.floatingFilter ? "cornflowerblue" : "teal",
          };
        },
      },
    ],
  },
  {
    field: "sport",
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerName: "The Sport the athlete participated in",
    headerClass: "sport-header",
  },
  {
    headerName: "Medal Details",
    headerStyle: (params) => {
      return {
        color: "white",
        backgroundColor: params.columnGroup?.isExpanded()
          ? "cornflowerblue"
          : "orangered",
      };
    },
    children: [
      { field: "bronze", columnGroupShow: "open" },
      { field: "silver", columnGroupShow: "open" },
      { field: "gold", columnGroupShow: "open" },
      {
        columnGroupShow: "closed",
        field: "total",
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    initialWidth: 200,

    floatingFilter: true,
    filter: true,
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
