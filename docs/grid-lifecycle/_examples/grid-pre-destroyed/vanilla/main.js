let columnWidths = undefined;

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "name", headerName: "Athlete" },
    { field: "medals.gold", headerName: "Gold Medals" },
    { field: "person.age", headerName: "Age" },
  ],
  rowData: getDataSet(),
  onGridPreDestroyed: (params) => {
    const allColumns = params.api.getColumns();
    if (!allColumns) {
      return;
    }

    const currentColumnWidths = allColumns.map((column) => ({
      field: column.getColDef().field || "-",
      width: column.getActualWidth(),
    }));

    displayColumnsWidth(currentColumnWidths);
    columnWidths = new Map(
      currentColumnWidths.map((columnWidth) => [
        columnWidth.field,
        columnWidth.width,
      ]),
    );
  },
};

const displayColumnsWidth = (values) => {
  const parentContainer = document.querySelector("#gridPreDestroyedState");
  const valuesContainer = parentContainer.querySelector(".values");
  if (!parentContainer || !valuesContainer) {
    return;
  }

  const html =
    "<ul>" +
    (values || [])
      .map(
        (value) => `<li>Field: ${value.field} | Width: ${value.width}px</li>`,
      )
      .join("") +
    "</ul>";

  parentContainer.style.display = "block";
  valuesContainer.innerHTML = html;

  const exampleButtons = document.querySelector("#exampleButtons");
  exampleButtons.style.display = "none";
};

function updateColumnWidth() {
  if (!gridApi) {
    return;
  }

  const newWidths = gridApi.getColumns().map((column) => {
    return {
      key: column.getColId(),
      newWidth: Math.round((150 + Math.random() * 100) * 100) / 100,
    };
  });
  gridApi.setColumnWidths(newWidths);
}

function destroyGrid() {
  if (!gridApi) {
    return;
  }

  gridApi.destroy();
  gridApi = undefined;
}

function reloadGrid() {
  const gridDiv = document.querySelector("#myGrid");

  const updatedColDefs =
    gridOptions.columnDefs && columnWidths
      ? gridOptions.columnDefs.map((val) => {
          const colDef = val;
          const result = {
            ...colDef,
          };

          if (colDef.field && columnWidths) {
            const restoredWidth = columnWidths.get(colDef.field);
            if (restoredWidth) {
              result.width = restoredWidth;
            }
          }

          return result;
        })
      : gridOptions.columnDefs;

  gridOptions.columnDefs = updatedColDefs;

  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  const parentContainer = document.querySelector("#gridPreDestroyedState");
  parentContainer.style.display = "none";

  const exampleButtons = document.querySelector("#exampleButtons");
  exampleButtons.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
