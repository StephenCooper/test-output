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
  ValueFormatterParams,
  ValueParserParams,
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

const valueFormatter = (params: ValueFormatterParams) => {
  const { value } = params;
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
};

const valueParser = (params: ValueParserParams) => {
  const { newValue } = params;

  if (newValue == null || newValue === "") {
    return null;
  }

  if (Array.isArray(newValue)) {
    return newValue;
  }

  return params.newValue.split(",");
};

const columnDefs: ColDef[] = [
  {
    headerName: "Multi Select",
    field: "colors",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      multiSelect: true,
      searchType: "matchAny",
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    } as IRichCellEditorParams,
  },
  {
    headerName: "Multi Select (No Pills)",
    field: "colors",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      suppressMultiSelectPillRenderer: true,
      multiSelect: true,
      searchType: "matchAny",
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    } as IRichCellEditorParams,
  },
  {
    headerName: "Multi Select (With Renderer)",
    field: "colors",
    cellRenderer: ColourCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: colors,
      cellRenderer: ColourCellRenderer,
      suppressMultiSelectPillRenderer: true,
      multiSelect: true,
      searchType: "matchAny",
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
  const numberOfOptions = getRandomNumber(1, 4);

  const selectedOptions: string[] = [];

  for (let i = 0; i < numberOfOptions; i++) {
    const color = colors[getRandomNumber(0, colors.length - 1)];
    if (selectedOptions.indexOf(color) === -1) {
      selectedOptions.push(color);
    }
  }

  selectedOptions.sort();

  return { colors: selectedOptions };
});

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    flex: 1,
    editable: true,
    valueFormatter: valueFormatter,
    valueParser: valueParser,
  },
  columnDefs: columnDefs,
  rowData: data,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
