// Grid API: Access to Grid API methods
let gridApi;

// Row Data Interface

function successIconSrc(params) {
  if (params === true) {
    return "https://www.ag-grid.com/example-assets/icons/tick-in-circle.png";
  } else {
    return "https://www.ag-grid.com/example-assets/icons/cross-in-circle.png";
  }
}

function refreshData() {
  gridApi.forEachNode((rowNode) => {
    rowNode.setDataValue("successful", Math.random() > 0.5);
  });
}

const onClick = () => alert("Mission Launched");
const gridOptions = {
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    {
      field: "company",
    },
    {
      field: "successful",
      headerName: "Success",
      cellRenderer: MissionResultRenderer,
    },
    {
      field: "successful",
      headerName: "Success",
      cellRenderer: MissionResultRenderer,
      cellRendererParams: {
        src: successIconSrc,
      },
    },
    {
      colId: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
      cellRendererParams: {
        onClick: onClick,
      },
    },
  ],
  defaultColDef: {
    flex: 1,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/small-space-mission-data.json")
    .then((response) => response.json())
    .then((data) => {
      gridApi.setGridOption("rowData", data);
    });
});

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  window.refreshData = refreshData;
}
