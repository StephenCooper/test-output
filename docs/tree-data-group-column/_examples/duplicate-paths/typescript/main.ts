import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [{ field: "employeeId" }],
  defaultColDef: {
    flex: 1,
  },
  autoGroupColumnDef: {
    headerName: "Organisation Chart",
    field: "name",

    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true,
  groupDefaultExpanded: 1,
  getDataPath: (data) => data.path,
};

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
// lookup the container we want the Grid to use
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;

// create the grid passing in the div to use together with the columns & data we want to use
gridApi = createGrid(gridDiv, gridOptions);
