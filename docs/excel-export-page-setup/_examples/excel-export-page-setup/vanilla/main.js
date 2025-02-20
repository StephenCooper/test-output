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
};

function getNumber(id) {
  const el = document.querySelector(id);

  if (!el || isNaN(el.value)) {
    return 0;
  }

  return parseFloat(el.value);
}

function getValue(id) {
  return document.querySelector(id).value;
}

function getSheetConfig() {
  return {
    pageSetup: {
      orientation: getValue("#pageOrientation"),
      pageSize: getValue("#pageSize"),
    },
    margins: {
      top: getNumber("#top"),
      right: getNumber("#right"),
      bottom: getNumber("#bottom"),
      left: getNumber("#left"),
      header: getNumber("#header"),
      footer: getNumber("#footer"),
    },
  };
}

function onFormSubmit(e) {
  e.preventDefault();
  const { pageSetup, margins } = getSheetConfig();
  gridApi.exportDataAsExcel({ pageSetup, margins });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  const form = document.querySelector("form");

  form?.addEventListener("submit", (e) => onFormSubmit(e));

  if (gridDiv) {
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((response) => response.json())
      .then((data) =>
        gridApi.setGridOption(
          "rowData",
          data.filter((rec) => rec.country != null),
        ),
      );
  }
});
