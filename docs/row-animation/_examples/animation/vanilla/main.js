let countDownDirection = true;

const columnDefs = [
  { field: "athlete", minWidth: 150 },
  { field: "country", minWidth: 150 },
  { field: "year", minWidth: 120 },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  columnDefs: columnDefs,
};

// the code below executes an action every 2,000 milliseconds.
// it's an interval, and each time it runs, it takes the next action
// from the 'actions' list below
function startInterval(api) {
  let actionIndex = 0;

  resetCountdown();
  executeAfterXSeconds();

  function executeAfterXSeconds() {
    setTimeout(() => {
      const action = getActions()[actionIndex];
      action(api);
      actionIndex++;
      if (actionIndex >= getActions().length) {
        actionIndex = 0;
      }
      resetCountdown();
      executeAfterXSeconds();
    }, 3000);
  }

  setTitleFormatted(null);
}

function resetCountdown() {
  document.querySelector("#animationCountdown").style.width = countDownDirection
    ? "100%"
    : "0%";
  countDownDirection = !countDownDirection;
}

function setTitleFormatted(apiName, methodName, paramsName) {
  let html;
  if (apiName === null) {
    html = '<span class="code-highlight-yellow">command:> </span>';
  } else {
    html =
      '<span class="code-highlight-yellow">command:> </span> ' +
      '<span class="code-highlight-blue">' +
      apiName +
      "</span>" +
      '<span class="code-highlight-blue">.</span>' +
      '<span class="code-highlight-yellow">' +
      methodName +
      "</span>" +
      '<span class="code-highlight-blue"></span>' +
      '<span class="code-highlight-blue">(</span>' +
      '<span class="code-highlight-green">' +
      paramsName +
      "</span>" +
      '<span class="code-highlight-blue">)</span>';
  }
  document.querySelector("#animationAction").innerHTML = html;
}

function getActions() {
  return [
    function (api) {
      api.applyColumnState({
        state: [{ colId: "country", sort: "asc" }],
        defaultState: { sort: null },
      });
      setTitleFormatted("api", "applyColumnState", "country: 'asc'");
    },
    function (api) {
      api.applyColumnState({
        state: [
          { colId: "year", sort: "asc" },
          { colId: "country", sort: "asc" },
        ],
        defaultState: { sort: null },
      });
      setTitleFormatted(
        "api",
        "applyColumnState",
        "year: 'asc', country 'asc'",
      );
    },
    function (api) {
      api.applyColumnState({
        state: [
          { colId: "year", sort: "asc" },
          { colId: "country", sort: "desc" },
        ],
        defaultState: { sort: null },
      });
      setTitleFormatted(
        "api",
        "applyColumnState",
        "year: 'asc', country: 'desc'",
      );
    },
    function (api) {
      api.applyColumnState({
        defaultState: { sort: null },
      });
      setTitleFormatted("api", "applyColumnState", "clear sort");
    },
  ];
}

// from actual demo page (/animation/)
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv =
    document.querySelector("#myGrid") ||
    document.querySelector("#animationGrid");

  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      gridApi.setGridOption("rowData", data.slice(0, 50));
      startInterval(gridApi);
    });
});
