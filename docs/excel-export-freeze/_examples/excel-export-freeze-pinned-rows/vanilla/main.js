const columnDefs = [
  {
    headerName: "Athlete Details",
    children: [
      {
        field: "athlete",
        width: 180,
        filter: "agTextColumnFilter",
      },
      {
        field: "age",
        width: 90,
        filter: "agNumberColumnFilter",
      },
      { headerName: "Country", field: "country", width: 140 },
    ],
  },
  {
    headerName: "Sports Results",
    children: [
      { field: "sport", width: 140 },
      {
        columnGroupShow: "closed",
        field: "total",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        columnGroupShow: "open",
        field: "gold",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        columnGroupShow: "open",
        field: "silver",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        columnGroupShow: "open",
        field: "bronze",
        width: 100,
        filter: "agNumberColumnFilter",
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  // debug: true,
  columnDefs: columnDefs,
  pinnedTopRowData: [
    {
      athlete: "TOP (athlete)",
      country: "TOP (country)",
      sport: "TOP (sport)",
    },
  ],
  pinnedBottomRowData: [
    {
      athlete: "BOTTOM (athlete)",
      country: "BOTTOM (country)",
      sport: "BOTTOM (sport)",
    },
  ],
  defaultExcelExportParams: {
    freezeRows: "headersAndPinnedRows",
  },
};

function onBtExport() {
  gridApi.exportDataAsExcel();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
