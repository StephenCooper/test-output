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
      preventStepping: true,
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

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
