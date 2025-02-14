const columnDefs = [
  {
    headerName: "Athlete Details",
    children: [
      {
        field: "athlete",
        width: 180,
      },
      {
        field: "age",
        width: 90,
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
      },
      {
        columnGroupShow: "open",
        field: "gold",
        width: 100,
      },
      {
        columnGroupShow: "open",
        field: "silver",
        width: 100,
      },
      {
        columnGroupShow: "open",
        field: "bronze",
        width: 100,
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  // debug: true,
  columnDefs: columnDefs,
  defaultExcelExportParams: {
    freezeRows: (params) => {
      const node = params.node;
      if (node == null) {
        return true;
      }
      return node.rowIndex < 20;
    },
    freezeColumns: (params) => params.column.getColId() !== "sport",
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
