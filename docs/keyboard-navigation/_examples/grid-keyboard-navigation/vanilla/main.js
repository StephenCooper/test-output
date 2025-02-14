const columnDefs = [
  {
    headerName: "Participant",
    children: [
      { field: "athlete", minWidth: 170 },
      { field: "country", minWidth: 150 },
    ],
  },
  { field: "sport" },
  {
    headerName: "Medals",
    children: [
      {
        field: "total",
        columnGroupShow: "closed",
        filter: "agNumberColumnFilter",
        width: 120,
        flex: 0,
      },
      {
        field: "gold",
        columnGroupShow: "open",
        filter: "agNumberColumnFilter",
        width: 100,
        flex: 0,
      },
      {
        field: "silver",
        columnGroupShow: "open",
        filter: "agNumberColumnFilter",
        width: 100,
        flex: 0,
      },
      {
        field: "bronze",
        columnGroupShow: "open",
        filter: "agNumberColumnFilter",
        width: 100,
        flex: 0,
      },
    ],
  },
  { field: "year", filter: "agNumberColumnFilter" },
];

let gridApi;

const gridOptions = {
  columnDefs,
  rowSelection: {
    mode: "multiRow",
  },
  defaultColDef: {
    editable: true,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    flex: 1,
  },
  sideBar: {
    toolPanels: ["columns", "filters"],
    defaultToolPanel: "",
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
