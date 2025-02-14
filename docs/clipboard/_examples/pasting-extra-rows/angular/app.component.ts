import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  ProcessDataFromClipboardParams,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  RowApiModule,
  ClientSideRowModelApiModule,
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

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowSelection]="rowSelection"
    [processDataFromClipboard]="processDataFromClipboard"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { headerName: "Athlete", field: "athlete", width: 150 },
    { headerName: "Age", field: "age", width: 90 },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "Year", field: "year", width: 90 },
    { headerName: "Date", field: "date", width: 110 },
    { headerName: "Sport", field: "sport", width: 110 },
  ];
  defaultColDef: ColDef = {
    editable: true,
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    checkboxes: false,
    headerCheckbox: false,
    enableClickSelection: true,
    copySelectedRows: true,
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data.slice(0, 8)));
  }

  processDataFromClipboard = (
    params: ProcessDataFromClipboardParams,
  ): string[][] | null => {
    const data = [...params.data];
    const emptyLastRow =
      data[data.length - 1][0] === "" && data[data.length - 1].length === 1;
    if (emptyLastRow) {
      data.splice(data.length - 1, 1);
    }
    const lastIndex = params.api!.getDisplayedRowCount() - 1;
    const focusedCell = params.api!.getFocusedCell();
    const focusedIndex = focusedCell!.rowIndex;
    if (focusedIndex + data.length - 1 > lastIndex) {
      const resultLastIndex = focusedIndex + (data.length - 1);
      const numRowsToAdd = resultLastIndex - lastIndex;
      const rowsToAdd: any[] = [];
      for (let i = 0; i < numRowsToAdd; i++) {
        const index = data.length - 1;
        const row = data.slice(index, index + 1)[0];
        // Create row object
        const rowObject: any = {};
        let currentColumn: any = focusedCell!.column;
        row.forEach((item) => {
          if (!currentColumn) {
            return;
          }
          rowObject[currentColumn.colDef.field] = item;
          currentColumn = params.api!.getDisplayedColAfter(currentColumn);
        });
        rowsToAdd.push(rowObject);
      }
      params.api!.applyTransaction({ add: rowsToAdd });
    }
    return data;
  };
}
