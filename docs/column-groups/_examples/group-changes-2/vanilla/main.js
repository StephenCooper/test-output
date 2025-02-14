function createNormalColDefs() {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
      ],
    },
    { field: "age", colId: "age" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
}

function createExtraColDefs() {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
        { field: "region1", colId: "region1" },
        { field: "region2", colId: "region2" },
      ],
    },
    { field: "age", colId: "age" },
    { field: "distance", colId: "distance" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
}

function onBtNormalCols() {
  gridApi.setGridOption("columnDefs", createNormalColDefs());
}

function onBtExtraCols() {
  gridApi.setGridOption("columnDefs", createExtraColDefs());
}

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 150,
  },
  // debug: true,
  columnDefs: createNormalColDefs(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
