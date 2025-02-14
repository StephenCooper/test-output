import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellStyleModule,
  CellValueChangedEvent,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  SetFilterModule,
  HighlightChangesModule,
  NumberFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [columnTypes]="columnTypes"
      [rowData]="rowData"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [suppressAggFuncInHeader]="true"
      (cellValueChanged)="onCellValueChanged($event)"
    />
  `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    // do NOT hide this column, it's needed for editing
    { field: "group", rowGroup: true, editable: true },
    { field: "a", type: "valueColumn" },
    { field: "b", type: "valueColumn" },
    { field: "c", type: "valueColumn" },
    { field: "d", type: "valueColumn" },
    {
      headerName: "Total",
      type: "totalColumn",
      // we use getValue() instead of data.a so that it gets the aggregated values at the group level
      valueGetter:
        'getValue("a") + getValue("b") + getValue("c") + getValue("d")',
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 100,
  };
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    valueColumn: {
      minWidth: 90,
      editable: true,
      aggFunc: "sum",
      valueParser: "Number(newValue)",
      cellClass: "number-cell",
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    totalColumn: {
      cellRenderer: "agAnimateShowChangeCellRenderer",
      cellClass: "number-cell",
    },
  };
  rowData: any[] | null = getRowData();
  groupDefaultExpanded = 1;

  onCellValueChanged(params: CellValueChangedEvent) {
    const changedData = [params.data];
    params.api.applyTransaction({ update: changedData });
  }
}

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 10; i++) {
    rowData.push({
      group: i < 5 ? "A" : "B",
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
    });
  }
  return rowData;
}
