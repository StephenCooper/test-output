import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColSpanParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "A",
      field: "author",
      width: 300,
      colSpan: colSpan,
    },
    {
      headerName: "Flexed Columns",
      children: [
        {
          headerName: "B",
          minWidth: 200,
          maxWidth: 350,
          flex: 2,
        },
        {
          headerName: "C",
          flex: 1,
        },
      ],
    },
  ];
  rowData: any[] | null = [1, 2];

  onGridReady(params: GridReadyEvent) {
    setInterval(fillAllCellsWithWidthMeasurement, 50);
  }
}

const colSpan = function (params: ColSpanParams) {
  return params.data === 2 ? 3 : 1;
};
function fillAllCellsWithWidthMeasurement() {
  Array.prototype.slice
    .call(document.querySelectorAll(".ag-cell"))
    .forEach((cell) => {
      const width = cell.offsetWidth;
      const isFullWidthRow = cell.parentElement.childNodes.length === 1;
      cell.textContent = (isFullWidthRow ? "Total width: " : "") + width + "px";
    });
}
