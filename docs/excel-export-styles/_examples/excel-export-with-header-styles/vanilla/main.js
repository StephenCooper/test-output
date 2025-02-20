const columnDefs = [
  { field: "athlete" },
  { field: "sport", minWidth: 150 },
  {
    headerName: "Medals",
    children: [
      { field: "gold", headerClass: "gold-header" },
      { field: "silver", headerClass: "silver-header" },
      { field: "bronze", headerClass: "bronze-header" },
    ],
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: columnDefs,

  defaultExcelExportParams: {
    headerRowHeight: 30,
  },

  excelStyles: [
    {
      id: "header",
      alignment: {
        vertical: "Center",
      },
      interior: {
        color: "#f8f8f8",
        pattern: "Solid",
        patternColor: undefined,
      },
      borders: {
        borderBottom: {
          color: "#ffab00",
          lineStyle: "Continuous",
          weight: 1,
        },
      },
    },
    {
      id: "headerGroup",
      font: {
        bold: true,
      },
    },
    {
      id: "gold-header",
      interior: {
        color: "#E4AB11",
        pattern: "Solid",
      },
    },
    {
      id: "silver-header",
      interior: {
        color: "#bbb4bb",
        pattern: "Solid",
      },
    },
    {
      id: "bronze-header",
      interior: {
        color: "#be9088",
        pattern: "Solid",
      },
    },
  ],
};

function onBtnExportDataAsExcel() {
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
