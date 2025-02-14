import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsFullWidthRowParams,
  ModuleRegistry,
  PinnedRowModule,
  RowHeightParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { FullWidthCellRenderer } from "./full-width-cell-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, FullWidthCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [rowData]="rowData"
    [pinnedTopRowData]="pinnedTopRowData"
    [pinnedBottomRowData]="pinnedBottomRowData"
    [columnDefs]="columnDefs"
    [isFullWidthRow]="isFullWidthRow"
    [fullWidthCellRenderer]="fullWidthCellRenderer"
    [getRowHeight]="getRowHeight"
  /> `,
})
export class AppComponent {
  rowData: any[] | null = createData(100, "body");
  pinnedTopRowData: any[] = createData(3, "pinned");
  pinnedBottomRowData: any[] = createData(3, "pinned");
  columnDefs: ColDef[] = getColumnDefs();
  isFullWidthRow: (params: IsFullWidthRowParams) => boolean = (
    params: IsFullWidthRowParams,
  ) => {
    // in this example, we check the fullWidth attribute that we set
    // while creating the data. what check you do to decide if you
    // want a row full width is up to you, as long as you return a boolean
    // for this method.
    return params.rowNode.data.fullWidth;
  };
  fullWidthCellRenderer: any = FullWidthCellRenderer;
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    // you can have normal rows and full width rows any height that you want
    const isBodyRow = params.node.rowPinned === undefined;
    const isFullWidth = params.node.data.fullWidth;
    if (isBodyRow && isFullWidth) {
      return 75;
    }
  };
}

function getColumnDefs() {
  const columnDefs: ColDef[] = [];
  alphabet().forEach((letter) => {
    const colDef: ColDef = {
      headerName: letter,
      field: letter,
      width: 150,
    };
    if (letter === "A") {
      colDef.pinned = "left";
    }
    if (letter === "Z") {
      colDef.pinned = "right";
    }
    columnDefs.push(colDef);
  });
  return columnDefs;
}
function alphabet() {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
}
function createData(count: number, prefix: string) {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    const item: any = {};
    // mark every third row as full width. how you mark the row is up to you,
    // in this example the example code (not the grid code) looks at the
    // fullWidth attribute in the isFullWidthRow() callback. how you determine
    // if a row is full width or not is totally up to you.
    item.fullWidth = i % 3 === 2;
    // put in a column for each letter of the alphabet
    alphabet().forEach((letter) => {
      item[letter] = prefix + " (" + letter + "," + i + ")";
    });
    rowData.push(item);
  }
  return rowData;
}
