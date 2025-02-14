let gridApi;

const gridOptions = {
  columnDefs: [{ field: "athlete" }, { field: "age" }, { field: "date" }],
  defaultColDef: {
    filter: true,
    floatingFilter: true,
    editable: true,
  },
  dataTypeDefinitions: {
    dateString: {
      baseDataType: "dateString",
      extendsDataType: "dateString",
      valueParser: (params) =>
        params.newValue != null && params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
          ? params.newValue
          : null,
      valueFormatter: (params) => (params.value == null ? "" : params.value),
      dataTypeMatcher: (value) =>
        typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
      dateParser: (value) => {
        if (value == null || value === "") {
          return undefined;
        }
        const dateParts = value.split("/");
        return dateParts.length === 3
          ? new Date(
              parseInt(dateParts[2]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[0]),
            )
          : undefined;
      },
      dateFormatter: (value) => {
        if (value == null) {
          return undefined;
        }
        const date = String(value.getDate());
        const month = String(value.getMonth() + 1);
        return `${date.length === 1 ? "0" + date : date}/${month.length === 1 ? "0" + month : month}/${value.getFullYear()}`;
      },
    },
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
