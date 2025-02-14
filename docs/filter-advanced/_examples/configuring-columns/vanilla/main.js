let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "athlete",
      filterParams: {
        caseSensitive: true,
        filterOptions: ["contains"],
      },
    },
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", hide: true },
    { field: "age", minWidth: 100, filter: false },
    {
      headerName: "Medals (+)",
      children: [
        { field: "gold", minWidth: 100 },
        { field: "silver", minWidth: 100 },
        { field: "bronze", minWidth: 100 },
      ],
    },
    {
      headerName: "Medals (-)",
      children: [
        {
          field: "gold",
          headerValueGetter: (params) =>
            params.location === "advancedFilter" ? "Gold (-)" : "Gold",
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "silver",
          headerValueGetter: (params) =>
            params.location === "advancedFilter" ? "Silver (-)" : "Silver",
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "bronze",
          headerValueGetter: (params) =>
            params.location === "advancedFilter" ? "Bronze (-)" : "Bronze",
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
      ],
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 180,
    filter: true,
  },
  groupDefaultExpanded: 1,
  enableAdvancedFilter: true,
};

function valueGetter(params) {
  return params.data ? params.data[params.colDef.field] * -1 : null;
}

let includeHiddenColumns = false;

function onIncludeHiddenColumnsToggled() {
  includeHiddenColumns = !includeHiddenColumns;
  gridApi.setGridOption(
    "includeHiddenColumnsInAdvancedFilter",
    includeHiddenColumns,
  );
  document.querySelector("#includeHiddenColumns").textContent =
    `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
