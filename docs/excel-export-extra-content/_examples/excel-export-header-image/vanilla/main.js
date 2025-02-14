let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  popupParent: document.body,

  defaultExcelExportParams: {
    headerFooterConfig: {
      all: {
        header: [
          {
            value: "&[Picture]",
            image: {
              id: "logo",
              base64: agGridLogo,
              width: 720,
              height: 250,
              imageType: "png",
              recolor: "Grayscale",
            },
            position: "Center",
          },
        ],
      },
    },
  },
};

function onBtExport() {
  gridApi.exportDataAsExcel();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
    .then((response) => response.json())
    .then((data) =>
      gridApi.setGridOption(
        "rowData",
        data.filter((rec) => rec.country != null),
      ),
    );
});
