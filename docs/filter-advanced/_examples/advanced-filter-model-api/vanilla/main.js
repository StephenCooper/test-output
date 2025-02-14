const initialAdvancedFilterModel = {
  filterType: "join",
  type: "AND",
  conditions: [
    {
      filterType: "join",
      type: "OR",
      conditions: [
        {
          filterType: "number",
          colId: "age",
          type: "greaterThan",
          filter: 23,
        },
        {
          filterType: "text",
          colId: "sport",
          type: "endsWith",
          filter: "ing",
        },
      ],
    },
    {
      filterType: "text",
      colId: "country",
      type: "contains",
      filter: "united",
    },
  ],
};

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "age", minWidth: 100 },
    { field: "gold", minWidth: 100 },
    { field: "silver", minWidth: 100 },
    { field: "bronze", minWidth: 100 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 180,
    filter: true,
  },
  enableAdvancedFilter: true,
  initialState: {
    filter: {
      advancedFilterModel: initialAdvancedFilterModel,
    },
  },
};

let savedFilterModel = null;

function saveFilterModel() {
  savedFilterModel = gridApi.getAdvancedFilterModel();
}

function restoreFilterModel() {
  gridApi.setAdvancedFilterModel(savedFilterModel);
}

function restoreFromHardCoded() {
  gridApi.setAdvancedFilterModel({
    filterType: "number",
    colId: "gold",
    type: "greaterThanOrEqual",
    filter: 1,
  });
}

function clearFilter() {
  gridApi.setAdvancedFilterModel(null);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
