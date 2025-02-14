const updateRowCount = (id) => {
  const element = document.querySelector(`#${id} > .value`);
  element.textContent = `${new Date().toLocaleTimeString()}`;
};

const setBtnReloadDataDisabled = (disabled) => {
  document.getElementById("btnReloadData").disabled = disabled;
};

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "name", headerName: "Athlete" },
    { field: "person.age", headerName: "Age" },
    { field: "medals.gold", headerName: "Gold Medals" },
  ],
  loading: true,
  onFirstDataRendered: (event) => {
    updateRowCount("firstDataRendered");
    console.log("First Data Rendered");
  },
  onRowDataUpdated: (event) => {
    updateRowCount("rowDataUpdated");
    console.log("Row Data Updated");
  },
  onGridReady: () => {
    console.log("Loading Data ...");
    fetchDataAsync()
      .then((data) => {
        console.log("Data Loaded");
        gridApi.setGridOption("rowData", data);
      })
      .catch((error) => {
        console.error("Failed to load data", error);
      })
      .finally(() => {
        gridApi.setGridOption("loading", false);
        setBtnReloadDataDisabled(false);
      });
  },
};

function onBtnReloadData() {
  console.log("Reloading Data ...");
  setBtnReloadDataDisabled(true);
  gridApi.setGridOption("loading", true);
  fetchDataAsync()
    .then((data) => {
      console.log("Data Reloaded");
      gridApi.setGridOption("rowData", data);
    })
    .catch((error) => {
      console.error("Failed to reload data", error);
    })
    .finally(() => {
      gridApi.setGridOption("loading", false);
      setBtnReloadDataDisabled(false);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
