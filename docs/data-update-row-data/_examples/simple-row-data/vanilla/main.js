const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

// specify the data
const rowDataA = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

const rowDataB = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "BMW", model: "M50", price: 60000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

let gridApi;

// let the grid know which columns and what data to use
const gridOptions = {
  columnDefs: columnDefs,
  rowData: rowDataA,
  rowSelection: {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true,
  },
};

function onRowDataA() {
  gridApi.setGridOption("rowData", rowDataA);
}

function onRowDataB() {
  gridApi.setGridOption("rowData", rowDataB);
}

function onClearRowData() {
  // Clear rowData by setting it to an empty array
  gridApi.setGridOption("rowData", []);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
