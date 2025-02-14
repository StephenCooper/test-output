const valueGetter = function (params) {
  return params.data["animalsString"].split("|");
};

const valueFormatter = function (params) {
  return params.value
    .map(function (animal) {
      return animal.name;
    })
    .join(", ");
};

let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Animals (array)",
      field: "animalsArray",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Animals (string)",
      filter: "agSetColumnFilter",
      valueGetter: valueGetter,
    },
    {
      headerName: "Animals (objects)",
      field: "animalsObjects",
      filter: "agSetColumnFilter",
      valueFormatter: valueFormatter,
      keyCreator: (params) => params.value.name,
      filterParams: {
        valueFormatter: (params) =>
          params.value ? params.value.name : "(Blanks)",
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    cellDataType: false,
  },
  rowData: getData(),
  sideBar: "filters",
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
