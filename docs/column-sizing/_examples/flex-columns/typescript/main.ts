import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColSpanParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const colSpan = function (params: ColSpanParams) {
  return params.data === 2 ? 3 : 1;
};

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: "A",
    field: "author",
    width: 300,
    colSpan: colSpan,
  },
  {
    headerName: "Flexed Columns",
    children: [
      {
        headerName: "B",
        minWidth: 200,
        maxWidth: 350,
        flex: 2,
      },
      {
        headerName: "C",
        flex: 1,
      },
    ],
  },
];

function fillAllCellsWithWidthMeasurement() {
  Array.prototype.slice
    .call(document.querySelectorAll(".ag-cell"))
    .forEach((cell) => {
      const width = cell.offsetWidth;
      const isFullWidthRow = cell.parentElement.childNodes.length === 1;
      cell.textContent = (isFullWidthRow ? "Total width: " : "") + width + "px";
    });
}

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData: [1, 2],
  onGridReady: (params) => {
    setInterval(fillAllCellsWithWidthMeasurement, 50);
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
