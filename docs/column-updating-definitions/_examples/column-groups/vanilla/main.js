function createColSetA() {
  return [
    {
      headerName: "Group A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ];
}

function createColSetB() {
  return [
    {
      headerName: "GROUP A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
        { field: "extraA" },
        { field: "extraB", columnGroupShow: "open" },
      ],
    },
  ];
}

let gridApi;

const gridOptions = {
  defaultColDef: {
    initialWidth: 100,
  },
  columnDefs: [
    {
      headerName: "Group A",
      groupId: "groupA",
      children: [
        { field: "athlete" },
        { field: "age" },
        { field: "country", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group B",
      children: [
        { field: "sport" },
        { field: "year" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Group C",
      groupId: "groupC",
      children: [
        { field: "total" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ],
};

function onBtSetA() {
  gridApi.setGridOption("columnDefs", createColSetA());
}

function onBtSetB() {
  gridApi.setGridOption("columnDefs", createColSetB());
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});
