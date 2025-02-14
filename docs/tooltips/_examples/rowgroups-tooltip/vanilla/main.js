const columnDefs = [
  { field: "country", width: 120, rowGroup: true, hide: true },
  { field: "year", width: 90, rowGroup: true, hide: true },
  { field: "athlete", width: 200 },
  { field: "age", width: 90 },
  { field: "sport", width: 110 },
];

let gridApi;

const gridOptions = {
  autoGroupColumnDef: {
    headerTooltip: "Group",
    minWidth: 190,
    tooltipValueGetter: (params) => {
      const count = params.node && params.node.allChildrenCount;

      if (count != null) {
        return "Tooltip text - " + params.value + " (" + count + ")";
      }

      return params.value;
    },
  },
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  tooltipShowDelay: 500,
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
