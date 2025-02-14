const originalColumnDefs = [
  { field: "athlete" },
  {
    field: "age",
    maxWidth: 120,
    filter: "agNumberColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    },
  },
  {
    headerName: "Description",
    valueGetter: (params) => `Age is ${params.data.age}`,
    minWidth: 340,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: originalColumnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowData: [
    {
      athlete: "Alberto Gutierrez",
      age: 36,
    },
    {
      athlete: "Niall Crosby",
      age: 40,
    },
    {
      athlete: "Sean Landsman",
      age: null,
    },
    {
      athlete: "Robert Clarke",
      age: undefined,
    },
  ],
};

function updateParams(toChange) {
  const value = document.getElementById(`checkbox${toChange}`).checked;
  originalColumnDefs[1].filterParams[`includeBlanksIn${toChange}`] = value;

  gridApi.setGridOption("columnDefs", originalColumnDefs);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
