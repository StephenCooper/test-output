let swimmingHeight;
let groupHeight;
let usaHeight;

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "athlete" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  rowData: getData(),
  groupDefaultExpanded: 1,
  getRowHeight: getRowHeight,
};

function getRowHeight(params) {
  if (params.node.group && groupHeight != null) {
    return groupHeight;
  } else if (
    params.data &&
    params.data.country === "United States" &&
    usaHeight != null
  ) {
    return usaHeight;
  } else if (
    params.data &&
    params.data.sport === "Swimming" &&
    swimmingHeight != null
  ) {
    return swimmingHeight;
  }
}

function setSwimmingHeight(height) {
  swimmingHeight = height;
  gridApi.resetRowHeights();
}

function setGroupHeight(height) {
  groupHeight = height;
  gridApi.resetRowHeights();
}

function setUsaHeight(height) {
  // this is used next time resetRowHeights is called
  usaHeight = height;

  gridApi.forEachNode(function (rowNode) {
    if (rowNode.data && rowNode.data.country === "United States") {
      rowNode.setRowHeight(height);
    }
  });
  gridApi.onRowHeightChanged();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
