let versionCounter = 0;
const columnDefs = [
  { field: "athlete" },
  { field: "country" },
  { field: "date" },
  { field: "version" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    sortable: false,
    enableCellChangeFlash: true,
  },
  columnDefs: columnDefs,
  rowSelection: { mode: "multiRow", headerCheckbox: false },
  // use the enterprise row model
  rowModelType: "serverSide",
  cacheBlockSize: 75,
  getRowId: (params) => `${params.data.athlete}-${params.data.date}`,
};

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);

      const response = server.getData(params.request);

      const dataWithVersion = response.rows.map((rowData) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });

      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

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

function updateSelectedRows() {
  versionCounter += 1;
  const version =
    versionCounter + " - " + versionCounter + " - " + versionCounter;
  const nodesToUpdate = gridApi.getSelectedNodes();
  nodesToUpdate.forEach((node) => {
    node.updateData({ ...node.data, version });
  });
}
