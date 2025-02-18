let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "countryObject", headerName: "Country" },
    { field: "sportObject", headerName: "Sport" },
  ],
  defaultColDef: {
    filter: true,
    floatingFilter: true,
    editable: true,
  },
  dataTypeDefinitions: {
    country: {
      baseDataType: "object",
      extendsDataType: "object",
      valueParser: (params) =>
        params.newValue == null || params.newValue === ""
          ? null
          : { code: params.newValue },
      valueFormatter: (params) =>
        params.value == null ? "" : params.value.code,
      dataTypeMatcher: (value) => value && !!value.code,
    },
    sport: {
      baseDataType: "object",
      extendsDataType: "object",
      valueParser: (params) =>
        params.newValue == null || params.newValue === ""
          ? null
          : { name: params.newValue },
      valueFormatter: (params) =>
        params.value == null ? "" : params.value.name,
      dataTypeMatcher: (value) => value && !!value.name,
    },
  },
  cellSelection: { handle: { mode: "fill" } },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) =>
      gridApi.setGridOption(
        "rowData",
        data.map((rowData) => {
          return {
            ...rowData,
            countryObject: {
              code: rowData.country,
            },
            sportObject: {
              name: rowData.sport,
            },
          };
        }),
      ),
    );
});
