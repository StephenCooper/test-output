let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    { field: "athlete", hide: true },
    {
      field: "date",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
      },
    },
    {
      field: "gold",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        treeListPathGetter: (gold) =>
          gold != null ? [gold > 2 ? ">2" : "<=2", String(gold)] : [null],
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
    floatingFilter: true,
    cellDataType: false,
  },
  autoGroupColumnDef: {
    field: "athlete",
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params) => (params.value ? params.value.join("#") : null),
    },
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) =>
      gridApi.setGridOption(
        "rowData",
        data.map((row) => {
          const dateParts = row.date.split("/");
          const newDate = new Date(
            parseInt(dateParts[2]),
            dateParts[1] - 1,
            dateParts[0],
          );
          return { ...row, date: newDate };
        }),
      ),
    );
});
