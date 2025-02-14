const columnDefs = [
  {
    headerName: "Name",
    valueGetter: (params) => {
      return params.data.firstName + " " + params.data.lastName;
    },
    valueSetter: (params) => {
      const fullName = params.newValue || "";
      const nameSplit = fullName.split(" ");
      const newFirstName = nameSplit[0];
      const newLastName = nameSplit[1];
      const data = params.data;

      if (data.firstName !== newFirstName || data.lastName !== newLastName) {
        data.firstName = newFirstName;
        data.lastName = newLastName;
        // return true to tell grid that the value has changed, so it knows
        // to update the cell
        return true;
      } else {
        // return false, the grid doesn't need to update
        return false;
      }
    },
  },
  {
    headerName: "A",
    field: "a",
  },
  {
    headerName: "B",
    valueGetter: (params) => {
      return params.data.b;
    },
    valueSetter: (params) => {
      const newVal = params.newValue;
      const valueChanged = params.data.b !== newVal;
      if (valueChanged) {
        params.data.b = newVal;
      }
      return valueChanged;
    },
    cellDataType: "number",
  },
  {
    headerName: "C.X",
    valueGetter: (params) => {
      if (params.data.c) {
        return params.data.c.x;
      } else {
        return undefined;
      }
    },
    valueSetter: (params) => {
      const newVal = params.newValue;
      if (!params.data.c) {
        params.data.c = {};
      }

      const valueChanged = params.data.c.x !== newVal;
      if (valueChanged) {
        params.data.c.x = newVal;
      }
      return valueChanged;
    },
    cellDataType: "number",
  },
  {
    headerName: "C.Y",
    valueGetter: (params) => {
      if (params.data.c) {
        return params.data.c.y;
      } else {
        return undefined;
      }
    },
    valueSetter: (params) => {
      const newVal = params.newValue;
      if (!params.data.c) {
        params.data.c = {};
      }

      const valueChanged = params.data.c.y !== newVal;
      if (valueChanged) {
        params.data.c.y = newVal;
      }
      return valueChanged;
    },
    cellDataType: "number",
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: getData(),
  onCellValueChanged: onCellValueChanged,
};

function onCellValueChanged(event) {
  console.log("Data after change is", event.data);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
