import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  TreeDataModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;

        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  autoGroupColumnDef: {
    headerName: "File Explorer",
    minWidth: 280,
    filter: "agTextColumnFilter",

    cellRendererParams: {
      suppressCount: true,
    },
  },
  rowData: getData(),
  treeData: true,
  getDataPath: (data) => data.path,
  getRowId: (params) => params.data.path[params.data.path.length - 1],
  onGridReady: () => {
    const node = gridApi.getRowNode("Proposal.docx");
    if (node) {
      gridApi.setRowNodeExpanded(node, true, true);
    }
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
