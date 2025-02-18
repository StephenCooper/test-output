import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  INumberCellEditorParams,
  ModuleRegistry,
  NumberEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    headerName: "Number Editor",
    field: "number",
    cellEditor: "agNumberCellEditor",
    cellEditorParams: {
      min: 0,
      max: 100,
    } as INumberCellEditorParams,
  },
];

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  number: index,
}));

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    width: 200,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: data,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
