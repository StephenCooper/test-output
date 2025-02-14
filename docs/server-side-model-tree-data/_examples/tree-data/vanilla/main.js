const columnDefs = [
  { field: "employeeId", hide: true },
  { field: "employeeName", hide: true },
  { field: "jobTitle" },
  { field: "employmentType" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 240,
    flex: 1,
    sortable: false,
  },
  autoGroupColumnDef: {
    field: "employeeName",
    cellRendererParams: {
      innerRenderer: (params) => {
        // display employeeName rather than group key (employeeId)
        return params.data.employeeName;
      },
    },
  },
  rowModelType: "serverSide",
  treeData: true,
  columnDefs: columnDefs,
  isServerSideGroupOpenByDefault: (params) => {
    // open first two levels by default
    return params.rowNode.level < 2;
  },
  isServerSideGroup: (dataItem) => {
    // indicate if node is a group
    return dataItem.group;
  },
  getServerSideGroupKey: (dataItem) => {
    // specify which group key to use
    return dataItem.employeeId;
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-tree-data.json")
    .then((response) => response.json())
    .then(function (data) {
      const fakeServer = createFakeServer(data);
      const datasource = createServerSideDatasource(fakeServer);
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});

function createFakeServer(fakeServerData) {
  const fakeServer = {
    data: fakeServerData,
    getData: function (request) {
      function extractRowsFromData(groupKeys, data) {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.children,
              employeeId: d.employeeId,
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              jobTitle: d.jobTitle,
            };
          });
        }

        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeId === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].children.slice(),
            );
          }
        }
      }

      return extractRowsFromData(request.groupKeys, this.data);
    },
  };

  return fakeServer;
}

function createServerSideDatasource(fakeServer) {
  const dataSource = {
    getRows: (params) => {
      console.log("ServerSideDatasource.getRows: params = ", params);

      const allRows = fakeServer.getData(params.request);

      const request = params.request;
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
      }, 200);
    },
  };

  return dataSource;
}
