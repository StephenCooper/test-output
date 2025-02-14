const columnDefs = [{ field: "accented", width: 150 }];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  accentedSort: true,
  rowData: [{ accented: "aàáä" }, { accented: "aäàá" }, { accented: "aáàä" }],
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
