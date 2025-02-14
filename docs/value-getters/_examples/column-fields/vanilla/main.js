let gridApi;

const gridOptions = {
  // define grid columns
  columnDefs: [
    { headerName: "Name (field)", field: "name" },
    // Using dot notation to access nested property
    { headerName: "Country (field & dot notation)", field: "person.country" },
    // Show default header name
    {
      headerName: "Total Medals (valueGetter)",
      valueGetter: (p) =>
        p.data.medals.gold + p.data.medals.silver + p.data.medals.bronze,
    },
  ],
  defaultColDef: {
    flex: 1,
  },
  rowData: getData(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
