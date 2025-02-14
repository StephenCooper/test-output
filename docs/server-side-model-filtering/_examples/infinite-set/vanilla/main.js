const columnDefs = [
  {
    field: "country",
    filter: "agSetColumnFilter",
    valueFormatter: countryValueFormatter,
    filterParams: {
      values: getCountryValuesAsync,
      keyCreator: countryCodeKeyCreator,
      valueFormatter: countryValueFormatter,
      comparator: countryComparator,
    },
  },
  {
    field: "sport",
    filter: "agMultiColumnFilter",
    filterParams: {
      filters: [
        {
          filter: "agTextColumnFilter",
          filterParams: {
            defaultOption: "startsWith",
          },
        },
        {
          filter: "agSetColumnFilter",
          filterParams: {
            values: getSportValuesAsync,
          },
        },
      ],
    },
    menuTabs: ["filterMenuTab"],
  },
  { field: "athlete" },
];

function countryCodeKeyCreator(params) {
  return params.value.code;
}

function countryValueFormatter(params) {
  return params.value.name;
}

function countryComparator(a, b) {
  // for complex objects, need to provide a comparator to choose what to sort by
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  },
  // use the server-side row model
  rowModelType: "serverSide",

  // fetch 100 rows at a time
  cacheBlockSize: 100,

  // only keep 10 blocks of rows
  maxBlocksInCache: 10,

  onFilterChanged: onFilterChanged,
};

let fakeServer;
let selectedCountries = null;
let textFilterStored = null;

function onFilterChanged() {
  const countryFilterModel = gridApi.getFilterModel()["country"];
  const sportFilterModel = gridApi.getFilterModel()["sport"];
  const selected = countryFilterModel && countryFilterModel.values;
  const textFilter = sportFilterModel?.filterModels[0]
    ? sportFilterModel.filterModels[0]
    : null;

  if (
    !areEqual(selectedCountries, selected) ||
    !areEqual(textFilterStored, textFilter)
  ) {
    selectedCountries = selected;
    textFilterStored = textFilter;

    console.log("Refreshing sports filter");
    gridApi.getColumnFilterInstance("sport").then((filter) => {
      filter.getChildFilterInstance(1).refreshFilterValues();
    });
    gridApi.getColumnFilterInstance("country").then((filter) => {
      filter.refreshFilterValues();
    });
  }
}

function areEqual(a, b) {
  if (a == null && b == null) {
    return true;
  }
  if (a != null || b != null) {
    return false;
  }

  return (
    a.length === b.length &&
    a.every(function (v, i) {
      return b[i] === v;
    })
  );
}

function getCountryValuesAsync(params) {
  const sportFilterModel = params.api.getFilterModel()["sport"];
  const countries = fakeServer.getCountries(sportFilterModel);

  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(countries);
  }, 500);
}

function getSportValuesAsync(params) {
  const sportFilterModel = params.api.getFilterModel()["sport"];
  const sports = fakeServer.getSports(selectedCountries, sportFilterModel);

  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(sports);
  }, 500);
}

function getServerSideDatasource(server) {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);

      // get data for request from our fake server
      const response = server.getData(params.request);

      // simulating real server call with a 500ms delay
      setTimeout(() => {
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

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      // we don't have unique codes in our dataset, so generate unique ones
      const namesToCodes = new Map();
      const codesToNames = new Map();
      data.forEach((row) => {
        row.countryName = row.country;
        if (namesToCodes.has(row.countryName)) {
          row.countryCode = namesToCodes.get(row.countryName);
        } else {
          row.countryCode = row.country.substring(0, 2).toUpperCase();
          if (codesToNames.has(row.countryCode)) {
            let num = 0;
            do {
              row.countryCode = `${row.countryCode[0]}${num++}`;
            } while (codesToNames.has(row.countryCode));
          }
          codesToNames.set(row.countryCode, row.countryName);
          namesToCodes.set(row.countryName, row.countryCode);
        }
        delete row.country;
      });
      // setup the fake server with entire dataset
      fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridApi.setGridOption("serverSideDatasource", datasource);
    });
});
