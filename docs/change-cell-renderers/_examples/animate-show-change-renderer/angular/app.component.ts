import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  ValueParserParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  RowApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="onUpdateSomeValues()">
        Update Some C &amp; D Values
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      headerName: "Editable A",
      field: "a",
      editable: true,
      valueParser: numberValueParser,
    },
    {
      headerName: "Editable B",
      field: "b",
      editable: true,
      valueParser: numberValueParser,
    },
    {
      headerName: "API C",
      field: "c",
      minWidth: 135,
      valueParser: numberValueParser,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "API D",
      field: "d",
      minWidth: 135,
      valueParser: numberValueParser,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Total",
      valueGetter: "data.a + data.b + data.c + data.d",
      minWidth: 135,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Average",
      valueGetter: "(data.a + data.b + data.c + data.d) / 4",
      minWidth: 135,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
  ];
  defaultColDef: ColDef = {
    minWidth: 105,
    flex: 1,
    cellClass: "align-right",
    valueFormatter: (params) => {
      return formatNumber(params.value);
    },
  };
  rowData: any[] | null = createRowData();

  onUpdateSomeValues() {
    const rowCount = this.gridApi.getDisplayedRowCount();
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(Math.random() * rowCount);
      const rowNode = this.gridApi.getDisplayedRowAtIndex(row)!;
      rowNode.setDataValue("c", Math.floor(Math.random() * 10000));
      rowNode.setDataValue("d", Math.floor(Math.random() * 10000));
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue);
}
function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}
function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 25435) % 10000),
      b: Math.floor(((i + 323) * 23221) % 10000),
      c: Math.floor(((i + 323) * 468276) % 10000),
      d: 0,
    });
  }
  return rowData;
}
