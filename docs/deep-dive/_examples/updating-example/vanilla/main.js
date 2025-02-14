// Grid API: Access to Grid API methods
let gridApi;

// Row Data Interface

// Grid Options: Contains all of the grid configurations
const gridOptions = {
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    { field: "mission" },
    { field: "company" },
    { field: "location" },
    { field: "date" },
    { field: "price" },
    { field: "successful" },
    { field: "rocket" },
  ],
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
gridApi = agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);

// Fetch Remote Data
fetch("https://www.ag-grid.com/example-assets/space-mission-data.json")
  .then((response) => response.json())
  .then((data) => gridApi.setGridOption("rowData", data));
