const columnDefs = [
  { field: "tradeId" },
  {
    field: "product",
    rowGroup: true,
    enableRowGroup: true,
    hide: true,
  },
  {
    field: "portfolio",
    rowGroup: true,
    enableRowGroup: true,
    hide: true,
  },
  {
    field: "book",
    rowGroup: true,
    enableRowGroup: true,
    hide: true,
  },
  { field: "previous", aggFunc: "sum" },
  { field: "current", aggFunc: "sum" },
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
  rowGroupPanelShow: "always",
  purgeClosedRowNodes: true,

  rowModelType: "serverSide",
  getRowId: getRowId,
  isServerSideGroupOpenByDefault: isServerSideGroupOpenByDefault,
  onColumnRowGroupChanged: onColumnRowGroupChanged,

  // fetch group child count from 'childCount' returned by the server
  getChildCount: getChildCount,
  onGridReady: (params) => {
    disable("#stopUpdates", true);

    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(getFakeServer());

    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);

    // register interest in data changes
    registerObserver({
      transactionFunc: (t) => params.api.applyServerSideTransactionAsync(t),
      groupedFields: ["product", "portfolio", "book"],
    });
  },
};

function startUpdates() {
  getFakeServer().randomUpdates();
  disable("#startUpdates", true);
  disable("#stopUpdates", false);
}
function stopUpdates() {
  getFakeServer().stopUpdates();
  disable("#stopUpdates", true);
  disable("#startUpdates", false);
}

function getChildCount(data) {
  return data ? data.childCount : undefined;
}

function disable(id, disabled) {
  document.querySelector(id).disabled = disabled;
}

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
      }, 300);
    },
  };
}

function getRowId(params) {
  let rowId = "";
  if (params.parentKeys && params.parentKeys.length) {
    rowId += params.parentKeys.join("-") + "-";
  }
  const groupCols = params.api.getRowGroupColumns();
  if (groupCols.length > params.level) {
    const thisGroupCol = groupCols[params.level];
    rowId += params.data[thisGroupCol.getColDef().field] + "-";
  }
  if (params.data.tradeId != null) {
    rowId += params.data.tradeId;
  }
  return rowId;
}

function onColumnRowGroupChanged(event) {
  const colState = event.api.getColumnState();

  const groupedColumns = colState.filter((state) => state.rowGroup);
  groupedColumns.sort((a, b) => a.rowGroupIndex - b.rowGroupIndex);
  const groupedFields = groupedColumns.map((col) => col.colId);

  registerObserver({
    transactionFunc: (t) => gridApi.applyServerSideTransactionAsync(t),
    groupedFields: groupedFields.length === 0 ? undefined : groupedFields,
  });
}

function isServerSideGroupOpenByDefault(params) {
  const route = params.rowNode.getRoute();
  if (!route) {
    return false;
  }
  const routeAsString = route.join(",");
  return (
    ["Wool", "Wool,Aggressive", "Wool,Aggressive,GL-62502"].indexOf(
      routeAsString,
    ) >= 0
  );
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
