const pathLookup = getData().reduce((pathMap, row) => {
  pathMap[row.path.key] = row.path.displayValue;
  return pathMap;
}, {});

let gridApi;

const gridOptions = {
  columnDefs: [{ field: "employmentType" }, { field: "jobTitle" }],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
    filter: true,
    floatingFilter: true,
    cellDataType: false,
  },
  autoGroupColumnDef: {
    headerName: "Employee",
    field: "path",
    cellRendererParams: {
      suppressCount: true,
    },
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params) => params.value.join("."),
      treeListFormatter: treeListFormatter,
      valueFormatter: valueFormatter,
    },
    minWidth: 280,
    valueFormatter: (params) => params.value.displayValue,
  },
  treeData: true,
  groupDefaultExpanded: -1,
  getDataPath: (data) => data.path.key.split("."),
  rowData: getData(),
};

function treeListFormatter(pathKey, _level, parentPathKeys) {
  return pathLookup[[...parentPathKeys, pathKey].join(".")];
}

function valueFormatter(params) {
  return params.value ? pathLookup[params.value.join(".")] : "(Blanks)";
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
