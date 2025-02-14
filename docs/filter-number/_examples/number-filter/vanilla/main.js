const numberValueFormatter = function (params) {
  return params.value.toFixed(2);
};

const saleFilterParams = {
  allowedCharPattern: "\\d\\-\\,\\$",
  numberParser: (text) => {
    return text == null
      ? null
      : parseFloat(text.replace(",", ".").replace("$", ""));
  },
  numberFormatter: (value) => {
    return value == null ? null : value.toString().replace(".", ",");
  },
};

const saleValueFormatter = function (params) {
  const formatted = params.value.toFixed(2).replace(".", ",");

  if (formatted.indexOf("-") === 0) {
    return "-$" + formatted.slice(1);
  }

  return "$" + formatted;
};

const columnDefs = [
  {
    field: "sale",
    headerName: "Sale ($)",
    filter: "agNumberColumnFilter",
    floatingFilter: true,
    valueFormatter: numberValueFormatter,
  },
  {
    field: "sale",
    headerName: "Sale",
    filter: "agNumberColumnFilter",
    floatingFilter: true,
    filterParams: saleFilterParams,
    valueFormatter: saleValueFormatter,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  rowData: getData(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
