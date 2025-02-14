let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "Name", field: "simple" },
    { headerName: "Bad Number", field: "numberBad" },
    {
      headerName: "Good Number",
      field: "numberGood",
      valueParser: numberParser,
    },
  ],
  defaultColDef: {
    flex: 1,
    editable: true,
    cellDataType: false,
  },
  rowData: getData(),
  onCellValueChanged: onCellValueChanged,
};

function onCellValueChanged(event) {
  console.log("data after changes is: ", event.data);
}

function numberParser(params) {
  return Number(params.newValue);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
