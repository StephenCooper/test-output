const athleteColumn = {
  headerName: "Athlete",
  valueGetter: (params) => {
    return params.data ? params.data.athlete : undefined;
  },
};

function getColDefsMedalsIncluded() {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
}

function getColDefsMedalsExcluded() {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
  ];
}

let gridApi;

const gridOptions = {
  defaultColDef: {
    initialWidth: 100,
  },
  columnDefs: getColDefsMedalsIncluded(),
};

function onBtExcludeMedalColumns() {
  gridApi.setGridOption("columnDefs", getColDefsMedalsExcluded());
}

function onBtIncludeMedalColumns() {
  gridApi.setGridOption("columnDefs", getColDefsMedalsIncluded());
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
