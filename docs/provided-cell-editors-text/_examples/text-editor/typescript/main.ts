import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ITextCellEditorParams,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { colors } from "./colors";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    field: "color",
    cellEditor: "agTextCellEditor",
    cellEditorParams: {
      maxLength: 20,
    } as ITextCellEditorParams,
  },
  {
    field: "value",
    valueFormatter: (params) => `£ ${params.value}`,
    cellEditor: "agTextCellEditor",
    cellEditorParams: {
      maxLength: 20,
    } as ITextCellEditorParams,
  },
];

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return {
    color: color,
    value: getRandomNumber(0, 1000),
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

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
