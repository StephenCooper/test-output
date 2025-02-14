const myTheme = agGrid.themeQuartz.withParams({
  headerColumnBorder: { color: "purple" },
  headerColumnBorderHeight: "80%",

  headerColumnResizeHandleColor: "orange",
  headerColumnResizeHandleHeight: "25%",
  headerColumnResizeHandleWidth: "5px",
});

let gridApi;

const gridOptions = {
  theme: myTheme,
  columnDefs: [
    {
      headerName: "Group 1",
      children: [
        { field: "athlete", minWidth: 170, resizable: true },
        { field: "age", resizable: true },
      ],
      resizable: true,
    },
    {
      headerName: "Group 2",
      children: [
        { field: "country" },
        { field: "year" },
        { field: "date" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ],
  defaultColDef: {
    editable: true,
    filter: true,
    resizable: false,
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
