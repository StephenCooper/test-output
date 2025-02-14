const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function getColumnDefs() {
  const columnDefs = [
    { headerName: "#", width: 80, valueGetter: "node.rowIndex" },
  ];

  ALPHABET.forEach((letter) => {
    columnDefs.push({
      headerName: letter.toUpperCase(),
      field: letter,
      width: 150,
    });
  });
  return columnDefs;
}

let gridApi;

const gridOptions = {
  columnDefs: getColumnDefs(),
  rowModelType: "infinite",
  rowSelection: { mode: "multiRow", headerCheckbox: false },
  maxBlocksInCache: 2,
  getRowId: (params) => {
    return params.data.a;
  },
  datasource: getDataSource(100),
  defaultColDef: {
    sortable: false,
  },
};

function getDataSource(count) {
  const dataSource = {
    rowCount: count,
    getRows: (params) => {
      const rowsThisPage = [];

      for (
        var rowIndex = params.startRow;
        rowIndex < params.endRow;
        rowIndex++
      ) {
        var record = {};
        ALPHABET.forEach(function (letter, colIndex) {
          const randomNumber = 17 + rowIndex + colIndex;
          const cellKey = letter.toUpperCase() + (rowIndex + 1);
          record[letter] = cellKey + " = " + randomNumber;
        });
        rowsThisPage.push(record);
      }

      // to mimic server call, we reply after a short delay
      setTimeout(() => {
        // no need to pass the second 'rowCount' parameter as we have already provided it
        params.successCallback(rowsThisPage);
      }, 100);
    },
  };
  return dataSource;
}

document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
