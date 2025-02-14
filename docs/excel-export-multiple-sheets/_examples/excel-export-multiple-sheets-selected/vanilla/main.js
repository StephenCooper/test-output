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

  columnDefs,
  rowSelection: {
    mode: "multiRow",
    checkboxes: false,
    headerCheckbox: false,
  },
};

function onBtExport() {
  const spreadsheets = [];

  let nodesToExport = [];
  gridApi.forEachNode((node, index) => {
    nodesToExport.push(node);

    if (index % 100 === 99) {
      gridApi.setNodesSelected({ nodes: nodesToExport, newValue: true });
      spreadsheets.push(
        gridApi.getSheetDataForExcel({
          onlySelected: true,
        }),
      );

      gridApi.deselectAll();
      nodesToExport = [];
    }
  });

  // check if the last page was exported

  if (gridApi.getSelectedNodes().length) {
    spreadsheets.push(
      gridApi.getSheetDataForExcel({
        onlySelected: true,
      }),
    );
    gridApi.deselectAll();
  }

  gridApi.exportMultipleSheetsAsExcel({
    data: spreadsheets,
    fileName: "ag-grid.xlsx",
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
