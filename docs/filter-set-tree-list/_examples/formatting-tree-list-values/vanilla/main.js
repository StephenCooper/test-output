let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport" },
    {
      field: "date",
      valueFormatter: dateCellValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        treeListFormatter: treeListFormatter,
        valueFormatter: dateFloatingFilterValueFormatter,
      },
    },
    {
      field: "gold",
    },
  ],
  defaultColDef: {
    flex: 1,
    floatingFilter: true,
    cellDataType: false,
  },
  autoGroupColumnDef: {
    field: "athlete",
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params) => (params.value ? params.value.join("#") : null),
      treeListFormatter: groupTreeListFormatter,
    },
    minWidth: 200,
  },
};

function dateCellValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : "";
}

function dateFloatingFilterValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : "(Blanks)";
}

function treeListFormatter(pathKey, level, _parentPathKeys) {
  if (level === 1) {
    const date = new Date();
    date.setMonth(Number(pathKey) - 1);
    return date.toLocaleDateString(undefined, { month: "long" });
  }
  return pathKey || "(Blanks)";
}

function groupTreeListFormatter(pathKey, level, _parentPathKeys) {
  if (level === 0 && pathKey) {
    return pathKey + " (" + pathKey.substring(0, 2).toUpperCase() + ")";
  }
  return pathKey || "(Blanks)";
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      const randomDays = [1, 4, 10, 15, 18];
      gridApi.setGridOption("rowData", [
        {},
        ...data.map((row) => {
          // generate pseudo-random dates
          const dateParts = row.date.split("/");
          const randomMonth =
            parseInt(dateParts[1]) - Math.floor(Math.random() * 3);
          const newDate = new Date(
            parseInt(dateParts[2]),
            randomMonth,
            randomMonth + randomDays[Math.floor(Math.random() * 5)],
          );
          return { ...row, date: newDate };
        }),
      ]);
    });
});
