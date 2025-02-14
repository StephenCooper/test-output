const colDefCountry = { field: "country", rowGroup: true };
const colDefYear = { field: "year", rowGroup: true };
const colDefAthlete = {
  field: "athlete",
  filter: "agSetColumnFilter",
  filterParams: {
    values: getAthletesAsync,
  },
  suppressHeaderMenuButton: true,
  suppressHeaderContextMenu: true,
};
const colDefAge = { field: "age" };
const colDefSport = { field: "sport" };
const colDefGold = { field: "gold", aggFunc: "sum" };
const colDefSilver = { field: "silver", aggFunc: "sum" };
const colDefBronze = { field: "bronze", aggFunc: "sum" };

const columnDefs = [
  colDefAthlete,
  colDefAge,
  colDefCountry,
  colDefYear,
  colDefSport,
  colDefGold,
  colDefSilver,
  colDefBronze,
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    initialFlex: 1,
    minWidth: 120,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  maintainColumnOrder: true,
  // use the server-side row model
  rowModelType: "serverSide",

  onGridReady: (params) => {
    document.getElementById("athlete").checked = true;
    document.getElementById("age").checked = true;
    document.getElementById("country").checked = true;
    document.getElementById("year").checked = true;
    document.getElementById("sport").checked = true;
    document.getElementById("gold").checked = true;
    document.getElementById("silver").checked = true;
    document.getElementById("bronze").checked = true;
  },

  suppressAggFuncInHeader: true,
  // debug: true,
};

function getAthletesAsync(params) {
  const countries = fakeServer.getAthletes();

  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(countries);
  }, 500);
}

function onBtApply() {
  const cols = [];
  if (getBooleanValue("#athlete")) {
    cols.push(colDefAthlete);
  }
  if (getBooleanValue("#age")) {
    cols.push(colDefAge);
  }
  if (getBooleanValue("#country")) {
    cols.push(colDefCountry);
  }
  if (getBooleanValue("#year")) {
    cols.push(colDefYear);
  }
  if (getBooleanValue("#sport")) {
    cols.push(colDefSport);
  }

  if (getBooleanValue("#gold")) {
    cols.push(colDefGold);
  }
  if (getBooleanValue("#silver")) {
    cols.push(colDefSilver);
  }
  if (getBooleanValue("#bronze")) {
    cols.push(colDefBronze);
  }

  gridApi.setGridOption("columnDefs", cols);
}

function getBooleanValue(cssSelector) {
  return document.querySelector(cssSelector).checked === true;
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
      }, 200);
    },
  };
}

var fakeServer = undefined;

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
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
