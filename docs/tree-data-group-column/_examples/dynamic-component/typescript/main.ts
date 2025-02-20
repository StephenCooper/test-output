import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
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
import { CustomGroupCellRenderer } from "./customGroupCellRenderer";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
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
];

const autoGroupColumnDef: ColDef = {
  cellRendererSelector: (params) => {
    if (params.node.level === 0) {
      return {
        component: "agGroupCellRenderer",
      };
    }
    return {
      component: CustomGroupCellRenderer,
    };
  },
};

let gridApi: GridApi;

const gridOptions: GridOptions = {
  treeData: true,
  getDataPath: (data) => data.path,
  columnDefs: columnDefs,
  autoGroupColumnDef: autoGroupColumnDef,
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  groupDefaultExpanded: -1,
  rowData: getData(),
  onCellDoubleClicked: (params: CellDoubleClickedEvent<IOlympicData, any>) => {
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  },
  onCellKeyDown: (params: CellKeyDownEvent<IOlympicData, any>) => {
    if (!("colDef" in params)) {
      return;
    }
    if (!(params.event instanceof KeyboardEvent)) {
      return;
    }
    if (params.event.code !== "Enter") {
      return;
    }
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
