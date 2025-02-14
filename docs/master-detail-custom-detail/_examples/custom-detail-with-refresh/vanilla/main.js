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
    enableCellChangeFlash: true,
  },
  masterDetail: true,
  detailCellRenderer: DetailCellRenderer,
  detailRowHeight: 70,
  groupDefaultExpanded: 1,
  onFirstDataRendered: onFirstDataRendered,
};

let allRowData;

function onFirstDataRendered(params) {
  setInterval(() => {
    if (!allRowData) {
      return;
    }

    const data = allRowData[0];

    const newCallRecords = [];
    data.callRecords.forEach((record, index) => {
      newCallRecords.push({
        name: record.name,
        callId: record.callId,
        duration: record.duration + (index % 2),
        switchCode: record.switchCode,
        direction: record.direction,
        number: record.number,
      });
    });

    data.callRecords = newCallRecords;
    data.calls++;

    const tran = {
      update: [data],
    };

    params.api.applyTransaction(tran);
  }, 2000);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
    .then((response) => response.json())
    .then((data) => {
      allRowData = data;
      gridApi.setGridOption("rowData", allRowData);
    });
});
