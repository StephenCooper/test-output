const filterParams = {
  maxNumConditions: 1,
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
  { field: "athlete" },
  {
    field: "country",
    filterParams: {
      filterOptions: ["contains", "startsWith", "endsWith"],
      defaultOption: "startsWith",
    },
  },
  {
    field: "sport",
    filterParams: {
      maxNumConditions: 10,
    },
  },
  {
    field: "age",
    filter: "agNumberColumnFilter",
    filterParams: {
      numAlwaysVisibleConditions: 2,
      defaultJoinOperator: "OR",
    },
    maxWidth: 100,
  },
  {
    field: "date",
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
