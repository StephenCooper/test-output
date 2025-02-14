import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellFocusedParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  Column,
  ColumnGroup,
  FocusGridInnerElementParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderFocusedParams,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div>
      <div class="form-container">
        <label>
          Input Above
          <input />
        </label>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [focusGridInnerElement]="focusGridInnerElement"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (cellFocused)="onCellFocused($event)"
      (headerFocused)="onHeaderFocused($event)"
      (gridReady)="onGridReady($event)"
    />
    <div class="form-container">
      <label>
        Input Below
        <input />
      </label>
    </div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { headerName: "#", colId: "rowNum", valueGetter: "node.id" },
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  focusGridInnerElement: (params: FocusGridInnerElementParams) => boolean = (
    params: FocusGridInnerElementParams,
  ) => {
    if (!lastFocused || !lastFocused.column) {
      return false;
    }
    if (lastFocused.rowIndex != null) {
      params.api.setFocusedCell(
        lastFocused.rowIndex,
        lastFocused.column as Column | string,
      );
    } else {
      params.api.setFocusedHeader(lastFocused.column);
    }
    return true;
  };
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onCellFocused(params: CellFocusedParams) {
    lastFocused = { column: params.column, rowIndex: params.rowIndex };
  }

  onHeaderFocused(params: HeaderFocusedParams) {
    lastFocused = { column: params.column, rowIndex: null };
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

let lastFocused:
  | {
      column: string | Column | ColumnGroup | null;
      rowIndex?: number | null;
    }
  | undefined;
