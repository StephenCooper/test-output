let minRowHeight = 25;
let currentRowHeight;

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", minWidth: 150 },
    { field: "age", minWidth: 70, maxWidth: 90 },
    { field: "country", minWidth: 130 },
    { field: "year", minWidth: 70, maxWidth: 90 },
    { field: "date", minWidth: 120 },
    { field: "sport", minWidth: 120 },
    { field: "gold", minWidth: 80 },
    { field: "silver", minWidth: 80 },
    { field: "bronze", minWidth: 80 },
    { field: "total", minWidth: 80 },
  ],

  rowData: getData(),
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
  onGridReady: (params) => {
    minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    currentRowHeight = minRowHeight;
  },
  onFirstDataRendered: onFirstDataRendered,
  onGridSizeChanged: onGridSizeChanged,
  getRowHeight: (params) => {
    return currentRowHeight;
  },
};

function onFirstDataRendered(params) {
  updateRowHeight(params);
}

function onGridSizeChanged(params) {
  updateRowHeight(params);
}

const updateRowHeight = (params) => {
  // get the height of the grid body - this excludes the height of the headers
  const bodyViewport = document.querySelector(".ag-body-viewport");
  if (!bodyViewport) {
    return;
  }

  const gridHeight = bodyViewport.clientHeight;
  // get the rendered rows
  const renderedRowCount = params.api.getDisplayedRowCount();

  // if the rendered rows * min height is greater than available height, just just set the height
  // to the min and let the scrollbar do its thing
  if (renderedRowCount * minRowHeight >= gridHeight) {
    if (currentRowHeight !== minRowHeight) {
      currentRowHeight = minRowHeight;
      params.api.resetRowHeights();
    }
  } else {
    // set the height of the row to the grid height / number of rows available
    currentRowHeight = Math.floor(gridHeight / renderedRowCount);
    params.api.resetRowHeights();
  }
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
