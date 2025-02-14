const columnDefs = [
  {
    headerName: "Athlete",
    field: "athlete",
    // here the Athlete column will tooltip the Country value
    tooltipField: "country",
    headerTooltip: "Tooltip for Athlete Column Header",
  },
  {
    field: "age",
    tooltipValueGetter: (p) =>
      "Create any fixed message, e.g. This is the Athlete’s Age ",
    headerTooltip: "Tooltip for Age Column Header",
  },
  {
    field: "year",
    tooltipValueGetter: (p) =>
      "This is a dynamic tooltip using the value of " + p.value,
    headerTooltip: "Tooltip for Year Column Header",
  },
  {
    headerName: "Hover For Tooltip",
    headerTooltip: "Column Groups can have Tooltips also",
    children: [
      {
        field: "sport",
        tooltipValueGetter: () => "Tooltip text about Sport should go here",
        headerTooltip: "Tooltip for Sport Column Header",
      },
    ],
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  columnDefs: columnDefs,
  tooltipShowDelay: 500,
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
