import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ILargeTextEditorParams,
  LargeTextEditorModule,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  LargeTextEditorModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    headerName: "Large Text Editor",
    field: "description",
    cellEditor: "agLargeTextCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      rows: 15,
      cols: 50,
    } as ILargeTextEditorParams,
  },
];

const data = Array.from(Array(20).keys()).map(() => {
  return {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
});

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    flex: 1,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: data,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
