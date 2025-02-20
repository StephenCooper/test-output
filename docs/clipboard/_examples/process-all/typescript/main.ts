import {
  CellSelectionOptions,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ProcessDataFromClipboardParams,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  TextEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "a" },
  { field: "b" },
  { field: "c" },
  { field: "d" },
  { field: "e" },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  rowData: getData(),
  columnDefs: columnDefs,
  cellSelection: true,

  defaultColDef: {
    editable: true,
    minWidth: 120,
    flex: 1,

    cellClassRules: {
      "cell-green": 'value.startsWith("Green")',
      "cell-blue": 'value.startsWith("Blue")',
      "cell-red": 'value.startsWith("Red")',
      "cell-yellow": 'value.startsWith("Yellow")',
    },
  },

  processDataFromClipboard,
};

function processDataFromClipboard(
  params: ProcessDataFromClipboardParams,
): string[][] | null {
  let containsRed;
  let containsYellow;
  const data = params.data;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    for (let j = 0; j < row.length; j++) {
      const value = row[j];
      if (value) {
        if (value.startsWith("Red")) {
          containsRed = true;
        } else if (value.startsWith("Yellow")) {
          containsYellow = true;
        }
      }
    }
  }

  if (containsRed) {
    // replace the paste request with another
    return [
      ["Custom 1", "Custom 2"],
      ["Custom 3", "Custom 4"],
    ];
  }

  if (containsYellow) {
    // cancels the paste
    return null;
  }

  return data;
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
