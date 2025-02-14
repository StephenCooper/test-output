const dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const cellDate = asDate(cellValue);

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
  { field: "athlete", minWidth: 180 },
  { field: "age", filter: "agNumberColumnFilter", maxWidth: 80 },
  { field: "country" },
  { field: "year", maxWidth: 90 },
  {
    field: "date",
    filter: "agDateColumnFilter",
    filterParams: dateFilterParams,
  },
  { field: "gold", filter: "agNumberColumnFilter" },
  { field: "silver", filter: "agNumberColumnFilter" },
  { field: "bronze", filter: "agNumberColumnFilter" },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 120,
    filter: true,
  },
  isExternalFilterPresent: isExternalFilterPresent,
  doesExternalFilterPass: doesExternalFilterPass,
};

let ageType = "everyone";

function isExternalFilterPresent() {
  // if ageType is not everyone, then we are filtering
  return ageType !== "everyone";
}

function doesExternalFilterPass(node) {
  if (node.data) {
    switch (ageType) {
      case "below25":
        return node.data.age < 25;
      case "between25and50":
        return node.data.age >= 25 && node.data.age <= 50;
      case "above50":
        return node.data.age > 50;
      case "dateAfter2008":
        return asDate(node.data.date) > new Date(2008, 1, 1);
      default:
        return true;
    }
  }
  return true;
}

function asDate(dateAsString) {
  const splitFields = dateAsString.split("/");
  return new Date(
    Number.parseInt(splitFields[2]),
    Number.parseInt(splitFields[1]) - 1,
    Number.parseInt(splitFields[0]),
  );
}

function externalFilterChanged(newValue) {
  ageType = newValue;
  gridApi.onFilterChanged();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      document.querySelector("#everyone").checked = true;
      gridApi.setGridOption("rowData", data);
    });
});
