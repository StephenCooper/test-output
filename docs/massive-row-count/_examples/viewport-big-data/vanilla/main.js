const columnDefs = [
  {
    headerName: "ID",
    field: "id",
  },
  {
    headerName: "Expected Position",
    valueGetter: '"translateY(" + node.rowIndex * 100 + "px)"',
  },

  {
    field: "a",
  },
  {
    field: "b",
  },
  {
    field: "c",
  },
];

let gridApi;

const gridOptions = {
  // debug: true,
  rowHeight: 100,
  columnDefs: columnDefs,
  rowModelType: "viewport",
  viewportDatasource: createViewportDatasource(),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

function createViewportDatasource() {
  let initParams;
  return {
    init: (params) => {
      initParams = params;
      const oneMillion = 1000 * 1000;
      params.setRowCount(oneMillion);
    },
    setViewportRange(firstRow, lastRow) {
      const rowData = {};

      for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
        const item = {};
        item.id = rowIndex;
        item.a = "A-" + rowIndex;
        item.b = "B-" + rowIndex;
        item.c = "C-" + rowIndex;
        rowData[rowIndex] = item;
      }

      initParams.setRowData(rowData);
    },
    destroy: () => {},
  };
}
