let gridApi;

const gridOptions = {
  columnDefs: [
    {
      field: "country",
      flex: 4,
      loadingCellRenderer: CustomLoadingCellRenderer,
    },
    { field: "sport", flex: 4 },
    { field: "year", flex: 3 },
    { field: "gold", aggFunc: "sum", flex: 2 },
    { field: "silver", aggFunc: "sum", flex: 2 },
    { field: "bronze", aggFunc: "sum", flex: 2 },
  ],
  defaultColDef: {
    loadingCellRenderer: () => "",
    minWidth: 75,
  },

  // use the server-side row model
  rowModelType: "serverSide",

  cacheBlockSize: 5,
  maxBlocksInCache: 0,
  rowBuffer: 0,
  maxConcurrentDatasourceRequests: 1,
  blockLoadDebounceMillis: 200,
  suppressServerSideFullWidthLoadingRow: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      // add id to data
      let idSequence = 0;
      data.forEach((item) => {
        item.id = idSequence++;
      });

      const server = getFakeServer(data);
      const datasource = getServerSideDatasource(server);
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
      // adding delay to simulate real server call
      setTimeout(() => {
        const response = server.getResponse(params.request);

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
      }, 1000);
    },
  };
}

function getFakeServer(allData) {
  return {
    getResponse: (request) => {
      console.log(
        "asking for rows: " + request.startRow + " to " + request.endRow,
      );

      // take a slice of the total rows
      const rowsThisPage = allData.slice(request.startRow, request.endRow);
      const lastRow = allData.length;

      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    },
  };
}
