let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;

        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    headerName: "File Explorer",
    minWidth: 280,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowSelection: {
    mode: "multiRow",
    groupSelects: "self",
  },
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  rowData: getData(),
  treeData: true,
  getDataPath: (data) => data.path,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

function getGroupSelectsValue() {
  return document.querySelector("#input-group-selection-mode")?.value ?? "self";
}

function onSelectionModeChange() {
  gridApi.setGridOption("rowSelection", {
    mode: "multiRow",
    groupSelects: getGroupSelectsValue(),
  });
}

function onQuickFilterChanged() {
  gridApi.setGridOption(
    "quickFilterText",
    document.querySelector("#input-quick-filter")?.value,
  );
}
