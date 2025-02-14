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
    return !!dataItem.underlings;
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

  fetch("https://www.ag-grid.com/example-assets/tree-data.json")
    .then((response) => response.json())
    .then(function (data) {
      const datasource = createServerSideDatasource(data);
      gridApi.setGridOption("serverSideDatasource", datasource);

      function createServerSideDatasource(data) {
        const dataSource = {
          getRows: (params) => {
            console.log("ServerSideDatasource.getRows: params = ", params);

            const request = params.request;
            if (request.groupKeys.length) {
              // this example doesn't need to support lower levels.
              params.fail();
              return;
            }

            const result = {
              rowData: data.slice(request.startRow, request.endRow),
            };
            console.log("getRows: result = ", result);
            setTimeout(() => {
              params.success(result);

              const recursivelyPopulateHierarchy = (route, node) => {
                if (node.underlings) {
                  gridApi.applyServerSideRowData({
                    route,
                    successParams: {
                      rowData: node.underlings,
                      rowCount: node.underlings.length,
                    },
                  });
                  node.underlings.forEach((child) => {
                    recursivelyPopulateHierarchy(
                      [...route, child.employeeId],
                      child,
                    );
                  });
                }
              };
              result.rowData.forEach((topLevelNode) => {
                recursivelyPopulateHierarchy(
                  [topLevelNode.employeeId],
                  topLevelNode,
                );
              });
            }, 200);
          },
        };

        return dataSource;
      }
    });
});
