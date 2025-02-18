import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  RowSelectionModule,
  RowSelectionOptions,
  SendToClipboardParams,
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
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],

  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
  },

  cellSelection: true,
  rowSelection: { mode: "multiRow" },

  sendToClipboard: sendToClipboard,
};

function sendToClipboard(params: SendToClipboardParams) {
  console.log("send to clipboard called with data:");
  console.log(params.data);
}

function onBtCopyRows() {
  gridApi!.copySelectedRowsToClipboard();
}

function onBtCopyRange() {
  gridApi!.copySelectedRangeToClipboard();
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtCopyRows = onBtCopyRows;
  (<any>window).onBtCopyRange = onBtCopyRange;
}
