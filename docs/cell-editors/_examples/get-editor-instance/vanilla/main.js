const columnDefs = [
  { field: "first_name", headerName: "First Name", width: 120, editable: true },
  { field: "last_name", headerName: "Last Name", width: 120, editable: true },
  {
    field: "gender",
    width: 100,
    cellEditor: MySimpleEditor,
  },
  {
    field: "age",
    width: 80,
    cellEditor: MySimpleEditor,
  },
  {
    field: "mood",
    width: 90,
    cellEditor: MySimpleEditor,
  },
  {
    field: "country",
    width: 110,
    cellEditor: MySimpleEditor,
  },
  {
    field: "address",
    width: 502,
    cellEditor: MySimpleEditor,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    minWidth: 100,
    filter: true,
  },
  rowData: getData(),
  onGridReady: (params) => {
    setInterval(() => {
      const instances = gridApi.getCellEditorInstances();
      if (instances.length > 0) {
        const instance = instances[0];
        if (instance.myCustomFunction) {
          const result = instance.myCustomFunction();
          console.log(
            `found editing cell: row index = ${result.rowIndex}, column = ${result.colId}.`,
          );
        } else {
          console.log(
            "found editing cell, but method myCustomFunction not found, must be the default editor.",
          );
        }
      } else {
        console.log("found not editing cell.");
      }
    }, 2000);
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
