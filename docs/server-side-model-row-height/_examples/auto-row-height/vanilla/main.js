const columnDefs = [
  {
    headerName: "Group",
    field: "name",
    rowGroup: true,
    hide: true,
  },
  {
    field: "autoA",
    wrapText: true,
    autoHeight: true,
    aggFunc: "last",
  },
  {
    field: "autoB",
    wrapText: true,
    autoHeight: true,
    aggFunc: "last",
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
  },
  autoGroupColumnDef: {
    flex: 1,
    maxWidth: 200,
  },
  // use the server-side row model
  rowModelType: "serverSide",

  suppressAggFuncInHeader: true,

  onGridReady: (params) => {
    // generate data for example
    const data = getData();

    // setup the fake server with entire dataset
    const fakeServer = new FakeServer(data);

    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(fakeServer);

    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);

      const response = server.getData(params.request);

      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
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
