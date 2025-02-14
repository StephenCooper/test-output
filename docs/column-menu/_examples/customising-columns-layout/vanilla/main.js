const columnDefs = [
  {
    groupId: "athleteGroupId",
    headerName: "Athlete",
    children: [
      {
        headerName: "Name",
        field: "athlete",
        minWidth: 150,
        columnChooserParams: {
          columnLayout: [
            {
              headerName: "Group 1", // Athlete group renamed to "Group 1"
              children: [
                // custom column order with columns "gold", "silver", "bronze" omitted
                { field: "sport" },
                { field: "athlete" },
                { field: "age" },
              ],
            },
          ],
        },
      },
      {
        field: "age",
        minWidth: 120,
      },
      {
        field: "sport",
        minWidth: 150,
        columnChooserParams: {
          // contracts all column groups
          contractColumnSelection: true,
        },
      },
    ],
  },
  {
    groupId: "medalsGroupId",
    headerName: "Medals",
    children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
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
