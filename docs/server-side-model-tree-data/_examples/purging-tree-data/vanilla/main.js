const columnDefs = [
  { field: "employeeId", hide: true },
  { field: "employeeName", hide: true },
  { field: "employmentType" },
  { field: "startDate" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 235,
    flex: 1,
    sortable: false,
  },
  autoGroupColumnDef: {
    field: "employeeName",
  },
  rowModelType: "serverSide",
  treeData: true,
  columnDefs: columnDefs,
  cacheBlockSize: 10,
  isServerSideGroupOpenByDefault: (params) => {
    const isKathrynPowers =
      params.rowNode.level == 0 && params.data.employeeName == "Kathryn Powers";
    const isMabelWard =
      params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
    return isKathrynPowers || isMabelWard;
  },
  isServerSideGroup: (dataItem) => {
    // indicate if node is a group
    return dataItem.group;
  },
  getServerSideGroupKey: (dataItem) => {
    // specify which group key to use
    return dataItem.employeeName;
  },
};

function refreshCache(route) {
  gridApi.refreshServerSide({ route: route, purge: true });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/tree-data.json")
    .then((response) => response.json())
    .then(function (data) {
      const fakeServer = createFakeServer(data);
      const datasource = createServerSideDatasource(fakeServer);
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});

function createFakeServer(fakeServerData) {
  const fakeServer = {
    getData: (request) => {
      function extractRowsFromData(groupKeys, data) {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.underlings,
              employeeId: d.employeeId + "",
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              startDate: d.startDate,
            };
          });
        }

        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeName === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].underlings.slice(),
            );
          }
        }
      }

      return extractRowsFromData(request.groupKeys, fakeServerData);
    },
  };
  return fakeServer;
}

function createServerSideDatasource(fakeServer) {
  const dataSource = {
    getRows: (params) => {
      console.log("ServerSideDatasource.getRows: params = ", params);
      const request = params.request;
      const allRows = fakeServer.getData(request);
      const doingInfinite = request.startRow != null && request.endRow != null;
      const result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      console.log("getRows: result = ", result);
      setTimeout(() => {
        params.success(result);
      }, 500);
    },
  };

  return dataSource;
}
