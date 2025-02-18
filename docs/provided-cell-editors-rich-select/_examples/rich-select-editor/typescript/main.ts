import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IRichCellEditorParams,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
  ValidationModule /* Development Only */,
]);

const languages = ["English", "Spanish", "French", "Portuguese", "(other)"];

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const columnDefs: ColDef[] = [
  {
    headerName: "Rich Select Editor",
    field: "language",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: languages,
    } as IRichCellEditorParams,
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    width: 200,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: new Array(100)
    .fill(null)
    .map(() => ({ language: languages[getRandomNumber(0, 4)] })),
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
