const columnDefs = [
  { field: "employeeId", hide: true },
  { field: "employeeName", hide: true },
  { field: "employmentType" },
  {
    field: "startDate",
    valueGetter: valueGetter,
    valueFormatter: cellValueFormatter,
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      excelMode: "windows",
      keyCreator: dateKeyCreator,
      valueFormatter: floatingFilterValueFormatter,
      values: getDatesAsync,
    },
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 240,
    filter: "agTextColumnFilter",
    floatingFilter: true,
    flex: 1,
    sortable: false,
  },
  autoGroupColumnDef: {
    field: "employeeName",
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      excelMode: "windows",
      keyCreator: treeDataKeyCreator,
      values: getEmployeesAsync,
    },
  },
  rowModelType: "serverSide",
  treeData: true,
  columnDefs: columnDefs,
  isServerSideGroupOpenByDefault: (params) => {
    // open first level by default
    return params.rowNode.level === 0;
  },
  isServerSideGroup: (dataItem) => {
    // indicate if node is a group
    return dataItem.underlings;
  },
  getServerSideGroupKey: (dataItem) => {
    // specify which group key to use
    return dataItem.employeeName;
  },
};

function valueGetter(params) {
  // server is returning a string, so need to convert to `Date`.
  // could instead do this inside `agGrid.IServerSideDatasource.getRows`
  return params.data.startDate ? new Date(params.data.startDate) : null;
}

function cellValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : null;
}

function floatingFilterValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : "(Blanks)";
}

function dateKeyCreator(params) {
  // this is what is being sent in the Filter Model to the server, so want the matching format
  return params.value ? params.value.toISOString() : null;
}

function treeDataKeyCreator(params) {
  // tree data group filter value is a string[], so convert to a unique string
  return params.value ? params.value.join(",") : null;
}

let fakeServer;

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);

      // simulating real server call with a 500ms delay
      setTimeout(() => {
        // get data for request from our fake server
        const response = server.getData(params.request);
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

function getDatesAsync(params) {
  if (!fakeServer) {
    // wait for init
    setTimeout(() => getDatesAsync(params), 500);
    return;
  }
  let dates = fakeServer.getDates();

  if (dates) {
    // values need to match the cell value (what the `valueGetter` returns)
    dates = dates.map((isoDateString) =>
      isoDateString ? new Date(isoDateString) : isoDateString,
    );
  }

  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(dates);
  }, 500);
}

function getEmployeesAsync(params) {
  if (!fakeServer) {
    // wait for init
    setTimeout(() => getEmployeesAsync(params), 500);
    return;
  }
  const employees = fakeServer.getEmployees();

  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(employees);
  }, 500);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/tree-data.json")
    .then((response) => response.json())
    .then(function (data) {
      // setup the fake server with entire dataset
      fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});
