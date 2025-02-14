const columnDefs = [
  { field: "athlete", minWidth: 200 },
  { field: "age" },
  { field: "country", minWidth: 200 },
  { field: "year" },
  { field: "date", minWidth: 150 },
  { field: "sport", minWidth: 150 },
  { field: "gold" },
  { field: "silver" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: columnDefs,
};

function onBtExport() {
  const sports = {};

  gridApi.forEachNode(function (node) {
    if (!sports[node.data.sport]) {
      sports[node.data.sport] = true;
    }
  });

  let spreadsheets = [];

  const performExport = async () => {
    for (const sport in sports) {
      await gridApi.setColumnFilterModel("sport", { values: [sport] });
      gridApi.onFilterChanged();

      if (gridApi.getColumnFilterModel("sport") == null) {
        throw new Error("Example error: Filter not applied");
      }

      const sheet = gridApi.getSheetDataForExcel({
        sheetName: sport,
      });
      if (sheet) {
        spreadsheets.push(sheet);
      }
    }

    await gridApi.setColumnFilterModel("sport", null);
    gridApi.onFilterChanged();

    gridApi.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: "ag-grid.xlsx",
    });

    spreadsheets = [];
  };

  performExport();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
