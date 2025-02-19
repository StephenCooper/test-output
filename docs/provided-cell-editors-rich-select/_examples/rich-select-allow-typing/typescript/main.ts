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
import { colors } from "./colors";
import { ColourCellRenderer } from "./colourCellRenderer";

ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    headerName: "Allow Typing (Match)",
    field: "color",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      searchType: "match",
      allowTyping: true,
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    } as IRichCellEditorParams,
  },
  {
    headerName: "Allow Typing (MatchAny)",
    field: "color",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      searchType: "matchAny",
      allowTyping: true,
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    } as IRichCellEditorParams,
  },
];

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return { color };
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
