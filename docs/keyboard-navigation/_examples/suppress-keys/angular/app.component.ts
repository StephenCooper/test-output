import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [defaultColDef]="defaultColDef"
    [rowSelection]="rowSelection"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      minWidth: 170,
      suppressKeyboardEvent: (params) => {
        return suppressEnter(params) || suppressNavigation(params);
      },
    },
    { field: "age" },
    {
      field: "country",
      minWidth: 130,
      suppressHeaderKeyboardEvent: (params) => {
        const key = params.event.key;
        return key === "ArrowLeft" || key === "ArrowRight" || key === "Enter";
      },
    },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
    suppressKeyboardEvent: suppressNavigation,
    suppressHeaderKeyboardEvent: suppressUpDownNavigation,
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    checkboxes: false,
    headerCheckbox: false,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

function suppressEnter(params: SuppressKeyboardEventParams) {
  const KEY_ENTER = "Enter";
  const event = params.event;
  const key = event.key;
  const suppress = key === KEY_ENTER;
  return suppress;
}
function suppressNavigation(params: SuppressKeyboardEventParams) {
  const KEY_A = "A";
  const KEY_C = "C";
  const KEY_V = "V";
  const KEY_D = "D";
  const KEY_PAGE_UP = "PageUp";
  const KEY_PAGE_DOWN = "PageDown";
  const KEY_TAB = "Tab";
  const KEY_LEFT = "ArrowLeft";
  const KEY_UP = "ArrowUp";
  const KEY_RIGHT = "ArrowRight";
  const KEY_DOWN = "ArrowDown";
  const KEY_F2 = "F2";
  const KEY_BACKSPACE = "Backspace";
  const KEY_ESCAPE = "Escape";
  const KEY_SPACE = " ";
  const KEY_DELETE = "Delete";
  const KEY_PAGE_HOME = "Home";
  const KEY_PAGE_END = "End";
  const event = params.event;
  const key = event.key;
  let keysToSuppress = [
    KEY_PAGE_UP,
    KEY_PAGE_DOWN,
    KEY_TAB,
    KEY_F2,
    KEY_ESCAPE,
  ];
  const editingKeys = [
    KEY_LEFT,
    KEY_RIGHT,
    KEY_UP,
    KEY_DOWN,
    KEY_BACKSPACE,
    KEY_DELETE,
    KEY_SPACE,
    KEY_PAGE_HOME,
    KEY_PAGE_END,
  ];
  if (event.ctrlKey || event.metaKey) {
    keysToSuppress.push(KEY_A);
    keysToSuppress.push(KEY_V);
    keysToSuppress.push(KEY_C);
    keysToSuppress.push(KEY_D);
  }
  if (!params.editing) {
    keysToSuppress = keysToSuppress.concat(editingKeys);
  }
  if (
    params.column.getId() === "country" &&
    (key === KEY_UP || key === KEY_DOWN)
  ) {
    return false;
  }
  const suppress = keysToSuppress.some(function (suppressedKey) {
    return suppressedKey === key || key.toUpperCase() === suppressedKey;
  });
  return suppress;
}
function suppressUpDownNavigation(
  params: SuppressHeaderKeyboardEventParams,
): boolean {
  const key = params.event.key;
  return key === "ArrowUp" || key === "ArrowDown";
}
