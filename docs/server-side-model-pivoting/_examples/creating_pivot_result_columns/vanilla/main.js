let gridApi;
const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "year", pivot: true }, // pivot on 'year'
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },

  // use the server-side row model
  rowModelType: "serverSide",

  // enable pivoting
  pivotMode: true,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      // setup the fake server with entire dataset
      const fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
      const request = params.request;

      console.log("[Datasource] - rows requested by grid: ", params.request);

      const response = server.getData(request);

      // add pivot results cols to the grid
      addPivotResultCols(request, response, params.api);

      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply data to grid
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

function addPivotResultCols(request, response, api) {
  // check if pivot colDefs already exist
  const existingPivotColDefs = api.getPivotResultColumns();
  if (existingPivotColDefs && existingPivotColDefs.length > 0) {
    return;
  }

  // create pivot colDef's based of data returned from the server
  const pivotResultColumns = createPivotResultColumns(
    request,
    response.pivotFields,
  );

  // supply pivot result columns to the grid
  api.setPivotResultColumns(pivotResultColumns);
}

function addColDef(colId, parts, res, request) {
  if (parts.length === 0) return [];

  const first = parts[0];
  const existing = res.find((r) => "groupId" in r && r.groupId === first);

  if (existing) {
    existing["children"] = addColDef(
      colId,
      parts.slice(1),
      existing.children,
      request,
    );
  } else {
    const colDef = {};
    const isGroup = parts.length > 1;

    if (isGroup) {
      colDef["groupId"] = first;
      colDef["headerName"] = first;
    } else {
      const valueCol = request.valueCols.find((r) => r.field === first);
      if (valueCol) {
        colDef["colId"] = colId;
        colDef["headerName"] = valueCol.displayName;
        colDef["field"] = colId;
      }
    }

    const children = addColDef(colId, parts.slice(1), [], request);
    if (children.length > 0) {
      colDef["children"] = children;
    }

    res.push(colDef);
  }

  return res;
}

function createPivotResultColumns(request, pivotFields) {
  if (request.pivotMode && request.pivotCols.length > 0) {
    const pivotResultCols = [];
    pivotFields.forEach((field) =>
      addColDef(field, field.split("_"), pivotResultCols, request),
    );
    return pivotResultCols;
  }

  return [];
}
