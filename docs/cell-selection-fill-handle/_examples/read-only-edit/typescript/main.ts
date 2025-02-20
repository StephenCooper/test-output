import {
  CellEditRequestEvent,
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
import { IOlympicDataWithId } from "./interfaces";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicDataWithId>;

const gridOptions: GridOptions<IOlympicDataWithId> = {
  columnDefs: [
    { field: "athlete", minWidth: 160 },
    { field: "age" },
    { field: "country", minWidth: 140 },
    { field: "year" },
    { field: "date", minWidth: 140 },
    { field: "sport", minWidth: 160 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    editable: true,
    cellDataType: false,
  },
  cellSelection: {
    handle: {
      mode: "fill",
    },
  },
  readOnlyEdit: true,
  getRowId: (params) => String(params.data.id),
  onCellEditRequest: onCellEditRequest,
};

let rowImmutableStore: any[];

function onCellEditRequest(event: CellEditRequestEvent) {
  const data = event.data;
  const field = event.colDef.field;
  const newValue = event.newValue;

  const oldItem = rowImmutableStore.find((row) => row.id === data.id);

  if (!oldItem || !field) {
    return;
  }

  const newItem = { ...oldItem };

  newItem[field] = newValue;

  console.log("onCellEditRequest, updating " + field + " to " + newValue);

  rowImmutableStore = rowImmutableStore.map((oldItem) =>
    oldItem.id == newItem.id ? newItem : oldItem,
  );
  gridApi.setGridOption("rowData", rowImmutableStore);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: any[]) => {
    data.forEach((item, index) => (item.id = index));
    rowImmutableStore = data;
    gridApi.setGridOption("rowData", rowImmutableStore);
  });
