const columnDefs = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "sport" },
  {
    headerName: "Medals",
    children: [
      {
        colId: "total",
        columnGroupShow: "closed",
        valueGetter: "data.gold + data.silver + data.bronze",
      },
      { columnGroupShow: "open", field: "gold" },
      { columnGroupShow: "open", field: "silver" },
      { columnGroupShow: "open", field: "bronze" },
    ],
  },
];
const defaultColDef = {
  filter: true,
  minWidth: 100,
};
// this is the grid options for the top grid
const gridOptionsTop = {
  defaultColDef,
  columnDefs,
  alignedGrids: () => [bottomApi],
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
};
const gridDivTop = document.querySelector("#myGridTop");
const topApi = agGrid.createGrid(gridDivTop, gridOptionsTop);

// this is the grid options for the bottom grid
const gridOptionsBottom = {
  defaultColDef,
  columnDefs,
  alignedGrids: () => [topApi],
};
const gridDivBottom = document.querySelector("#myGridBottom");
const bottomApi = agGrid.createGrid(gridDivBottom, gridOptionsBottom);

function onCbAthlete(value) {
  // we only need to update one grid, as the other is a slave
  topApi.setColumnsVisible(["athlete"], value);
}

function onCbAge(value) {
  // we only need to update one grid, as the other is a slave
  topApi.setColumnsVisible(["age"], value);
}

function onCbCountry(value) {
  // we only need to update one grid, as the other is a slave
  topApi.setColumnsVisible(["country"], value);
}

function setData(rowData) {
  topApi.setGridOption("rowData", rowData);
  bottomApi.setGridOption("rowData", rowData);
}

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => setData(data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  window.onCbAthlete = onCbAthlete;
  window.onCbAge = onCbAge;
  window.onCbCountry = onCbCountry;
}
