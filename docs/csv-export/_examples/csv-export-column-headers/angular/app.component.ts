import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { ColumnMenuModule, ContextMenuModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <div style="display: flex; flex-direction: column; height: 100%">
      <div style="display: flex">
        <div class="row">
          <label for="columnGroups"
            ><input id="columnGroups" type="checkbox" />Skip Column Group
            Headers</label
          >
          <label for="skipHeader"
            ><input id="skipHeader" type="checkbox" />Skip Column Headers</label
          >
        </div>
      </div>

      <div style="margin: 10px 0">
        <button (click)="onBtnUpdate()">Show CSV export content text</button>
        <button (click)="onBtnExport()">Download CSV export file</button>
      </div>

      <div
        style="flex: 1 1 0; position: relative; display: flex; flex-direction: row; gap: 20px"
      >
        <div id="gridContainer" style="flex: 1">
          <ag-grid-angular
            style="width: 100%; height: 100%;"
            [defaultColDef]="defaultColDef"
            [suppressExcelExport]="true"
            [popupParent]="popupParent"
            [columnDefs]="columnDefs"
            [rowData]="rowData"
            (gridReady)="onGridReady($event)"
          />
        </div>
        <textarea
          id="csvResult"
          style="flex: 1"
          placeholder="Click the Show CSV export content button to view exported CSV here"
        ></textarea>
      </div>
    </div>
  `,
})
export class AppComponent {
  private gridApi!: GridApi;

  defaultColDef: ColDef = {
    editable: true,
    minWidth: 100,
    flex: 1,
  };
  popupParent: HTMLElement | null = document.body;
  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: "Brand", children: [{ field: "make" }, { field: "model" }] },
    {
      headerName: "Value",
      children: [{ field: "price" }],
    },
  ];
  rowData: any[] | null = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ];

  onBtnExport() {
    this.gridApi.exportDataAsCsv(getParams());
  }

  onBtnUpdate() {
    (document.querySelector("#csvResult") as any).value =
      this.gridApi.getDataAsCsv(getParams());
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    (document.getElementById("columnGroups") as HTMLInputElement).checked =
      true;
  }
}

function getBoolean(id: string) {
  const field = document.querySelector("#" + id) as HTMLInputElement;
  return !!field.checked;
}
function getParams() {
  return {
    skipColumnGroupHeaders: getBoolean("columnGroups"),
    skipColumnHeaders: getBoolean("skipHeader"),
  };
}
