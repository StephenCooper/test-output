const columnDefs = [
  { field: "athlete", minWidth: 200 },
  { field: "age" },
  { field: "country", minWidth: 200 },
  { field: "year" },
  { field: "sport", minWidth: 200 },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  postProcessPopup: (params) => {
    // check callback is for menu
    if (params.type !== "columnMenu") {
      return;
    }
    const columnId = params.column ? params.column.getId() : undefined;
    if (columnId === "age") {
      const ePopup = params.ePopup;

      let oldTopStr = ePopup.style.top;
      // remove 'px' from the string (AG Grid uses px positioning)
      oldTopStr = oldTopStr.substring(0, oldTopStr.indexOf("px"));
      const oldTop = parseInt(oldTopStr);
      const newTop = oldTop + 25;

      ePopup.style.top = newTop + "px";
    }
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
