const columnDefs = [
  { field: "athlete", colId: "athlete" },
  { field: "age", colId: "age" },
  { field: "country", colId: "country" },
  { field: "year", colId: "year" },
  { field: "date", colId: "date" },
  { field: "total", colId: "total" },
  { field: "gold", colId: "gold" },
  { field: "silver", colId: "silver" },
  { field: "bronze", colId: "bronze" },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    initialWidth: 150,
    filter: true,
  },
  columnDefs: columnDefs,
  maintainColumnOrder: true,
};

function onBtNoGroups() {
  const columnDefs = [
    { field: "athlete", colId: "athlete" },
    { field: "age", colId: "age" },
    { field: "country", colId: "country" },
    { field: "year", colId: "year" },
    { field: "date", colId: "date" },
    { field: "total", colId: "total" },
    { field: "gold", colId: "gold" },
    { field: "silver", colId: "silver" },
    { field: "bronze", colId: "bronze" },
  ];
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onMedalsInGroupOnly() {
  const columnDefs = [
    { field: "athlete", colId: "athlete" },
    { field: "age", colId: "age" },
    { field: "country", colId: "country" },
    { field: "year", colId: "year" },
    { field: "date", colId: "date" },
    {
      headerName: "Medals",
      headerClass: "medals-group",
      children: [
        { field: "total", colId: "total" },
        { field: "gold", colId: "gold" },
        { field: "silver", colId: "silver" },
        { field: "bronze", colId: "bronze" },
      ],
    },
  ];
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onParticipantInGroupOnly() {
  const columnDefs = [
    {
      headerName: "Participant",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "age", colId: "age" },
        { field: "country", colId: "country" },
        { field: "year", colId: "year" },
        { field: "date", colId: "date" },
      ],
    },
    { field: "total", colId: "total" },
    { field: "gold", colId: "gold" },
    { field: "silver", colId: "silver" },
    { field: "bronze", colId: "bronze" },
  ];
  gridApi.setGridOption("columnDefs", columnDefs);
}

function onParticipantAndMedalsInGroups() {
  const columnDefs = [
    {
      headerName: "Participant",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "age", colId: "age" },
        { field: "country", colId: "country" },
        { field: "year", colId: "year" },
        { field: "date", colId: "date" },
      ],
    },
    {
      headerName: "Medals",
      headerClass: "medals-group",
      children: [
        { field: "total", colId: "total" },
        { field: "gold", colId: "gold" },
        { field: "silver", colId: "silver" },
        { field: "bronze", colId: "bronze" },
      ],
    },
  ];
  gridApi.setGridOption("columnDefs", columnDefs);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
