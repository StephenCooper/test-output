import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
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
    [accentedSort]="true"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [{ field: "accented", width: 150 }];
  rowData: any[] | null = [
    { accented: "aàáä" },
    { accented: "aäàá" },
    { accented: "aáàä" },
  ];
}
