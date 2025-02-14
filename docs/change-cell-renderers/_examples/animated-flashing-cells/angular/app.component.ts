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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
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
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "a", enableCellChangeFlash: true },
    { field: "b", enableCellChangeFlash: true },
    { field: "c", cellRenderer: "agAnimateShowChangeCellRenderer" },
    { field: "d", cellRenderer: "agAnimateShowChangeCellRenderer" },
    { field: "e", cellRenderer: "agAnimateSlideCellRenderer" },
    { field: "f", cellRenderer: "agAnimateSlideCellRenderer" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellClass: "align-right",
    valueFormatter: (params) => {
      return formatNumber(params.value);
    },
  };
  rowData: any[] | null = createRowData();

  onGridReady(params: GridReadyEvent) {
    const updateValues = () => {
      const rowCount = params.api!.getDisplayedRowCount();
      // pick 2 cells at random to update
      for (let i = 0; i < 2; i++) {
        const row = Math.floor(Math.random() * rowCount);
        const rowNode = params.api!.getDisplayedRowAtIndex(row)!;
        const col = ["a", "b", "c", "d", "e", "f"][
          Math.floor(Math.random() * 6)
        ];
        rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
      }
    };
    setInterval(updateValues, 250);
  }
}

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}
function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 145045) % 10000),
      b: Math.floor(((i + 323) * 543020) % 10000),
      c: Math.floor(((i + 323) * 305920) % 10000),
      d: Math.floor(((i + 323) * 204950) % 10000),
      e: Math.floor(((i + 323) * 103059) % 10000),
      f: Math.floor(((i + 323) * 468276) % 10000),
    });
  }
  return rowData;
}
