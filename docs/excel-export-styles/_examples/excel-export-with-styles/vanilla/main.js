const columnDefs = [
  { field: "athlete", minWidth: 200 },
  {
    field: "age",
    cellClassRules: {
      greenBackground: (params) => {
        return params.value < 23;
      },
      redFont: (params) => {
        return params.value < 20;
      },
    },
  },
  {
    field: "country",
    minWidth: 200,
    cellClassRules: {
      redFont: (params) => {
        return params.value === "United States";
      },
    },
  },
  {
    headerName: "Group",
    valueGetter: "data.country.charAt(0)",
    cellClass: ["redFont", "greenBackground"],
  },
  {
    field: "year",
    cellClassRules: {
      notInExcel: (params) => {
        return true;
      },
    },
  },
  { field: "sport", minWidth: 150 },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    cellClassRules: {
      darkGreyBackground: (params) => {
        return (params.node.rowIndex || 0) % 2 == 0;
      },
    },
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: columnDefs,

  excelStyles: [
    {
      id: "cell",
      alignment: {
        vertical: "Center",
      },
    },
    {
      id: "greenBackground",
      interior: {
        color: "#b5e6b5",
        pattern: "Solid",
      },
    },
    {
      id: "redFont",
      font: {
        fontName: "Calibri Light",
        underline: "Single",
        italic: true,
        color: "#BB0000",
      },
    },
    {
      id: "darkGreyBackground",
      interior: {
        color: "#888888",
        pattern: "Solid",
      },
      font: {
        fontName: "Calibri Light",
        color: "#ffffff",
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
