let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    headerComponent: CustomHeader,
  },
};

function onBtUpperNames() {
  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.headerName = c.field.toUpperCase();
  });
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onBtLowerNames() {
  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.headerName = c.field;
  });
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onBtFilterOn() {
  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.filter = true;
  });
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onBtFilterOff() {
  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.filter = false;
  });
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onBtResizeOn() {
  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.resizable = true;
  });
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onBtResizeOff() {
  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.resizable = false;
  });
  gridApi.setGridOption("columnDefs", columnDefs);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      gridApi.setGridOption("rowData", data);
    });
});
