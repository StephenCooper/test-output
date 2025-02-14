const rowData = [
  { value: 14, type: "age" },
  { value: "Female", type: "gender" },
  { value: "Happy", type: "mood" },
  { value: 21, type: "age" },
  { value: "Male", type: "gender" },
  { value: "Sad", type: "mood" },
];

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "value" },
    {
      headerName: "Rendered Value",
      field: "value",
      cellRendererSelector: (params) => {
        const moodDetails = {
          component: MoodRenderer,
        };

        const genderDetails = {
          component: GenderRenderer,
          params: { values: ["Male", "Female"] },
        };
        if (params.data) {
          if (params.data.type === "gender") return genderDetails;
          else if (params.data.type === "mood") return moodDetails;
        }
        return undefined;
      },
    },
    { field: "type" },
  ],
  defaultColDef: {
    flex: 1,
    cellDataType: false,
  },
  rowData: rowData,
  onRowEditingStarted: (event) => {
    console.log("never called - not doing row editing");
  },
  onRowEditingStopped: (event) => {
    console.log("never called - not doing row editing");
  },
  onCellEditingStarted: (event) => {
    console.log("cellEditingStarted");
  },
  onCellEditingStopped: (event) => {
    console.log("cellEditingStopped");
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
