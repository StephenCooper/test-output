// Grid API: Access to Grid API methods
let gridApi;

// Row Data Interface

const gridOptions = {
  defaultColDef: {
    flex: 10,
  },
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    {
      field: "company",
      flex: 6,
    },
    {
      field: "website",
      cellRenderer: CompanyRenderer,
    },
    {
      headerName: "Logo",
      field: "company",
      cellRenderer: CompanyLogoRenderer,
      cellClass: "logoCell",
      minWidth: 100,
    },
    {
      field: "revenue",
      cellRenderer: PriceRenderer,
    },
    {
      field: "hardware",
      headerName: "Hardware",
      cellRenderer: MissionResultRenderer,
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
    },
  ],
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-company-data.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
