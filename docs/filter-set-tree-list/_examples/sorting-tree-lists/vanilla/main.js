let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "employmentType" },
    {
      field: "startDate",
      valueFormatter: (params) =>
        params.value ? params.value.toLocaleDateString() : params.value,
      filterParams: {
        treeList: true,
        comparator: reverseOrderComparator,
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
    filter: true,
    floatingFilter: true,
    cellDataType: false,
  },
  autoGroupColumnDef: {
    headerName: "Employee",
    field: "employeeName",
    cellRendererParams: {
      suppressCount: true,
    },
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params) => (params.value ? params.value.join("#") : null),
      comparator: arrayComparator,
    },
    minWidth: 280,
  },
  treeData: true,
  groupDefaultExpanded: -1,
  getDataPath: (data) => {
    return data.dataPath;
  },
  getRowId: (params) => String(params.data.employeeId),
};

function arrayComparator(a, b) {
  if (a == null) {
    return b == null ? 0 : -1;
  } else if (b == null) {
    return 1;
  }
  for (let i = 0; i < a.length; i++) {
    if (i >= b.length) {
      return 1;
    }
    const comparisonValue = reverseOrderComparator(a[i], b[i]);
    if (comparisonValue !== 0) {
      return comparisonValue;
    }
  }
  return 0;
}

function reverseOrderComparator(a, b) {
  return a < b ? 1 : a > b ? -1 : 0;
}

function processData(data) {
  const flattenedData = [];
  const flattenRowRecursive = (row, parentPath) => {
    const dateParts = row.startDate.split("/");
    const startDate = new Date(
      parseInt(dateParts[2]),
      dateParts[1] - 1,
      dateParts[0],
    );
    const dataPath = [...parentPath, row.employeeName];
    flattenedData.push({ ...row, dataPath, startDate });
    if (row.underlings) {
      row.underlings.forEach((underling) =>
        flattenRowRecursive(underling, dataPath),
      );
    }
  };
  data.forEach((row) => flattenRowRecursive(row, []));
  return flattenedData;
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/tree-data.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", processData(data)));
});
