const columnDefs = [
  { field: "tradeId" },
  { field: "portfolio", hide: true, rowGroup: true },
  { field: "book" },
  { field: "previous" },
  { field: "current" },
];

let gridApi;

const gridOptions = {
  columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    enableCellChangeFlash: true,
  },
  autoGroupColumnDef: {
    minWidth: 220,
  },
  isServerSideGroupOpenByDefault: (params) => {
    return (
      params.rowNode.key === "Aggressive" || params.rowNode.key === "Hybrid"
    );
  },
  getRowId: (params) => {
    if (params.level === 0) {
      return params.data.portfolio;
    }
    return String(params.data.tradeId);
  },
  onGridReady: (params) => {
    // setup the fake server
    const server = new FakeServer(data);

    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(server);

    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
  },

  rowModelType: "serverSide",
};

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
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
      }, 300);
    },
  };
}

function logResults(transaction, result) {
  console.log(
    "[Example] - Applied transaction:",
    transaction,
    "Result:",
    result,
  );
}

function deleteAllHybrid() {
  // NOTE: real applications would be better served listening to a stream of changes from the server instead
  const serverResponse = deletePortfolioOnServer("Hybrid");
  if (!serverResponse.success) {
    console.warn("Nothing has changed on the server");
    return;
  }

  if (serverResponse) {
    // apply tranaction to keep grid in sync
    const transaction = {
      remove: [{ portfolio: "Hybrid" }],
    };
    const result = gridApi.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }
}

function createOneAggressive() {
  // NOTE: real applications would be better served listening to a stream of changes from the server instead
  const serverResponse = createRowOnServer("Aggressive", "Aluminium", "GL-1");
  if (!serverResponse.success) {
    console.warn("Nothing has changed on the server");
    return;
  }

  if (serverResponse.newGroupCreated) {
    // if a new group had to be created, reflect in the grid
    const transaction = {
      route: [],
      add: [{ portfolio: "Aggressive" }],
    };
    const result = gridApi.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  } else {
    // if the group already existed, add rows to it
    const transaction = {
      route: ["Aggressive"],
      add: [serverResponse.newRecord],
    };
    const result = gridApi.applyServerSideTransaction(transaction);
    logResults(transaction, result);
  }
}

function updateAggressiveToHybrid() {
  // NOTE: real applications would be better served listening to a stream of changes from the server instead
  const serverResponse = changePortfolioOnServer("Aggressive", "Hybrid");
  if (!serverResponse.success) {
    console.warn("Nothing has changed on the server");
    return;
  }

  const transaction = {
    remove: [{ portfolio: "Aggressive" }],
  };
  // aggressive group no longer exists, so delete the group
  const result = gridApi.applyServerSideTransaction(transaction);
  logResults(transaction, result);

  if (serverResponse.newGroupCreated) {
    // hybrid group didn't exist, so just create the new group
    const t = {
      route: [],
      add: [{ portfolio: "Hybrid" }],
    };
    const r = gridApi.applyServerSideTransaction(t);
    logResults(t, r);
  } else {
    // hybrid group already existed, add rows to it
    const t = {
      route: ["Hybrid"],
      add: serverResponse.updatedRecords,
    };
    const r = gridApi.applyServerSideTransaction(t);
    logResults(t, r);
  }
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
