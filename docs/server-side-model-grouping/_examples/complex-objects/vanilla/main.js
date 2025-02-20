const columnDefs = [
  // here we are using a valueGetter to get the country name from the complex object
  {
    colId: "country",
    valueGetter: "data.country.name",
    rowGroup: true,
    hide: true,
  },

  { field: "gold", aggFunc: "sum", enableValue: true },
  { field: "silver", aggFunc: "sum", enableValue: true },
  { field: "bronze", aggFunc: "sum", enableValue: true },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    flex: 1,
    minWidth: 280,
  },
  // use the server-side row model
  rowModelType: "serverSide",
};

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);

      const response = server.getData(params.request);

      // convert country to a complex object
      const resultsWithComplexObjects = response.rows.map(function (row) {
        row.country = {
          name: row.country,
          code: row.country.substring(0, 3).toUpperCase(),
        };
        return row;
      });

      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: resultsWithComplexObjects,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 200);
    },
  };
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      // setup the fake server with entire dataset
      const fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});
