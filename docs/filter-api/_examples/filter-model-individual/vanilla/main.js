const filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }

    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }

    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

const columnDefs = [
  { field: "athlete", filter: "agTextColumnFilter" },
  { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
  { field: "country", filter: "agTextColumnFilter" },
  { field: "year", filter: "agNumberColumnFilter", maxWidth: 100 },
  { field: "sport", filter: "agTextColumnFilter" },
  { field: "gold", filter: "agNumberColumnFilter" },
  { field: "silver", filter: "agNumberColumnFilter" },
  { field: "bronze", filter: "agNumberColumnFilter" },
  { field: "total", filter: "agNumberColumnFilter" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  sideBar: "filters",
  onGridReady: (params) => {
    params.api.getToolPanelInstance("filters").expandFilters(["athlete"]);
  },
};

let savedFilterModel = null;

function clearFilter() {
  gridApi.setColumnFilterModel("athlete", null).then(() => {
    gridApi.onFilterChanged();
  });
}

function saveFilterModel() {
  savedFilterModel = gridApi.getColumnFilterModel("athlete");

  const convertTextFilterModel = (model) => {
    return `${model.type} ${model.filter}`;
  };
  const convertCombinedFilterModel = (model) => {
    return model.conditions
      .map((condition) => convertTextFilterModel(condition))
      .join(` ${model.operator} `);
  };

  let savedFilterString;
  if (!savedFilterModel) {
    savedFilterString = "(none)";
  } else if (savedFilterModel.operator) {
    savedFilterString = convertCombinedFilterModel(savedFilterModel);
  } else {
    savedFilterString = convertTextFilterModel(savedFilterModel);
  }

  document.querySelector("#savedFilters").innerText = savedFilterString;
}

function restoreFilterModel() {
  gridApi.setColumnFilterModel("athlete", savedFilterModel).then(() => {
    gridApi.onFilterChanged();
  });
}

function restoreFromHardCoded() {
  const hardcodedFilter = { type: "startsWith", filter: "Mich" };
  gridApi.setColumnFilterModel("athlete", hardcodedFilter).then(() => {
    gridApi.onFilterChanged();
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
