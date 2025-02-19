import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomEditorModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { getData } from "./data";
import { GenderRenderer } from "./genderRenderer";
import { MoodEditor } from "./moodEditor";
import { MoodRenderer } from "./moodRenderer";
import { SimpleTextEditor } from "./simpleTextEditor";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RichSelectModule,
  NumberEditorModule,
  TextEditorModule,
  CustomEditorModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "first_name", headerName: "Provided Text" },
  {
    field: "last_name",
    headerName: "Custom Text",
    cellEditor: SimpleTextEditor,
  },
  {
    field: "age",
    headerName: "Provided Number",
    cellEditor: "agNumberCellEditor",
  },
  {
    field: "gender",
    headerName: "Provided Rich Select",
    cellRenderer: GenderRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      cellRenderer: GenderRenderer,
      values: ["Male", "Female"],
    },
  },
  {
    field: "mood",
    headerName: "Custom Mood",
    cellRenderer: MoodRenderer,
    cellEditor: MoodEditor,
    cellEditorPopup: true,
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData: getData(),
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
