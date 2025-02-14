import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  RowClassRules,
  RowStyleModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";

ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  rowData: getData(),
  columnDefs: [
    { headerName: "Employee", field: "employee" },
    { headerName: "Number Sick Days", field: "sickDays", editable: true },
  ],
  rowClassRules: {
    // row style function
    "sick-days-warning": (params) => {
      const numSickDays = params.data.sickDays;
      return numSickDays > 5 && numSickDays <= 7;
    },
    // row style expression
    "sick-days-breach": "data.sickDays >= 8",
  },
};

function setData() {
  gridApi!.forEachNode(function (rowNode) {
    const newData = {
      employee: rowNode.data.employee,
      sickDays: randomInt(),
    };
    rowNode.setData(newData);
  });
}

function randomInt() {
  return Math.floor(Math.random() * 10);
}

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
const eGridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(eGridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).setData = setData;
}
