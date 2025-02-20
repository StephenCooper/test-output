import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  PinnedRowModule,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  RowPinnedType,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "firstName" },
    { field: "lastName" },
    { field: "gender" },
    { field: "age" },
    { field: "mood" },
    { field: "country" },
    { field: "address", minWidth: 550 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 110,
    editable: true,
  },
  rowData: getData(),
  pinnedTopRowData: getPinnedTopData(),
  pinnedBottomRowData: getPinnedBottomData(),
  onRowEditingStarted: (event: RowEditingStartedEvent) => {
    console.log("never called - not doing row editing");
  },
  onRowEditingStopped: (event: RowEditingStoppedEvent) => {
    console.log("never called - not doing row editing");
  },
  onCellEditingStarted: (event: CellEditingStartedEvent) => {
    console.log("cellEditingStarted");
  },
  onCellEditingStopped: (event: CellEditingStoppedEvent) => {
    console.log("cellEditingStopped");
  },
};

function getPinnedTopData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}

function getPinnedBottomData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}
function onBtStopEditing() {
  gridApi!.stopEditing();
}

function onBtStartEditing(key?: string, pinned?: RowPinnedType) {
  gridApi!.setFocusedCell(0, "lastName", pinned);

  gridApi!.startEditingCell({
    rowIndex: 0,
    colKey: "lastName",
    // set to 'top', 'bottom' or undefined
    rowPinned: pinned,
    key: key,
  });
}

function onBtNextCell() {
  gridApi!.tabToNextCell();
}

function onBtPreviousCell() {
  gridApi!.tabToPreviousCell();
}

function onBtWhich() {
  const cellDefs = gridApi!.getEditingCells();
  if (cellDefs.length > 0) {
    const cellDef = cellDefs[0];
    console.log(
      "editing cell is: row = " +
        cellDef.rowIndex +
        ", col = " +
        cellDef.column.getId() +
        ", floating = " +
        cellDef.rowPinned,
    );
  } else {
    console.log("no cells are editing");
  }
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtStopEditing = onBtStopEditing;
  (<any>window).onBtStartEditing = onBtStartEditing;
  (<any>window).onBtNextCell = onBtNextCell;
  (<any>window).onBtPreviousCell = onBtPreviousCell;
  (<any>window).onBtWhich = onBtWhich;
}
