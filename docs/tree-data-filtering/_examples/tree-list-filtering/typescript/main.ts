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
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TreeDataModule,
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
    minWidth: 200,
  },
  autoGroupColumnDef: {
    cellRendererParams: {
      suppressCount: true,
    },
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params) => (params.value ? params.value.join("#") : null),
    },
  },
  treeData: true,
  groupDefaultExpanded: -1,
  getDataPath: (data: any) => data.path,
  rowData: getData(),
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
