let gridApi;

const gridOptions = {
  columnDefs: [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ],
  defaultColDef: {
    flex: 1,
  },
  masterDetail: true,
  detailRowHeight: 195,
  detailCellRendererParams: (params) => {
    const res = {};

    // we use the same getDetailRowData for both options
    res.getDetailRowData = function (params) {
      params.successCallback(params.data.callRecords);
    };

    const nameMatch =
      params.data.name === "Mila Smith" ||
      params.data.name === "Harper Johnson";

    if (nameMatch) {
      // grid options for columns {callId, number}
      res.detailGridOptions = {
        columnDefs: [{ field: "callId" }, { field: "number" }],
        defaultColDef: {
          flex: 1,
        },
      };
    } else {
      // grid options for columns {callId, direction, duration, switchCode}
      res.detailGridOptions = {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode" },
        ],
        defaultColDef: {
          flex: 1,
        },
      };
    }

    return res;
  },
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  // arbitrarily expand a row for presentational purposes
  setTimeout(() => {
    const node1 = params.api.getDisplayedRowAtIndex(1);
    const node2 = params.api.getDisplayedRowAtIndex(2);
    node1.setExpanded(true);
    node2.setExpanded(true);
  }, 0);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
