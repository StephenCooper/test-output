const originalColumnDefs = [
  { field: "athlete" },
  {
    field: "date",
    cellDataType: "date",
    filter: "agDateColumnFilter",
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
    valueGetter: (params) => {
      let date = params.data.date;
      if (date != null) {
        date = params.api.getCellValue({
          rowNode: params.node,
          colKey: "date",
          useFormatter: true,
        });
      }
      return `Date is ${date}`;
    },
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
      date: null,
    },
    {
      athlete: "Niall Crosby",
      date: undefined,
    },
    {
      athlete: "Sean Landsman",
      date: new Date(2016, 9, 25),
    },
    {
      athlete: "Robert Clarke",
      date: new Date(2016, 9, 25),
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
