import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  EditableCallbackParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  NumberEditorModule,
  TextEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button style="font-size: 12px" (click)="setEditableYear(2008)">
        Enable Editing for 2008
      </button>
      <button style="font-size: 12px" (click)="setEditableYear(2012)">
        Enable Editing for 2012
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [columnTypes]="columnTypes"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", type: "editableColumn" },
    { field: "age", type: "editableColumn" },
    { field: "year" },
    { field: "country" },
    { field: "sport" },
    { field: "total" },
  ];
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    editableColumn: {
      editable: (params: EditableCallbackParams<IOlympicData>) => {
        return isCellEditable(params);
      },
      cellStyle: (params: CellClassParams<IOlympicData>) => {
        if (isCellEditable(params)) {
          return { backgroundColor: "#2244CC44" };
        }
      },
    },
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  setEditableYear(year: number) {
    editableYear = year;
    // Redraw to re-apply the new cell style
    this.gridApi.redrawRows();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

let editableYear = 2012;
function isCellEditable(params: EditableCallbackParams | CellClassParams) {
  return params.data.year === editableYear;
}
