import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<button (click)="onBtPrinterFriendly()">
      Printer Friendly Layout
    </button>
    <button (click)="onBtNormal()">Normal Layout</button>

    <h3>Latin Text</h3>

    <p>
      Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
      neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri. Pro
      no ubique explicari, his reque nulla consequuntur in. His soleat doctus
      constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
    </p>

    <ag-grid-angular
      id="myGrid"
      style="width: 400px; height: 200px;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
    />

    <h3>More Latin Text</h3>

    <p>
      Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
      neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri. Pro
      no ubique explicari, his reque nulla consequuntur in. His soleat doctus
      constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
    </p> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { headerName: "ID", valueGetter: "node.rowIndex + 1", width: 70 },
    { field: "model", width: 150 },
    { field: "color" },
    { field: "price", valueFormatter: '"$" + value.toLocaleString()' },
    { field: "year" },
    { field: "country" },
  ];
  rowData: any[] | null = getData();
  defaultColDef: ColDef = {
    width: 100,
  };

  onBtPrinterFriendly() {
    const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
    eGridDiv.style.width = "";
    eGridDiv.style.height = "";
    this.gridApi.setGridOption("domLayout", "print");
  }

  onBtNormal() {
    const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
    eGridDiv.style.width = "400px";
    eGridDiv.style.height = "200px";
    // Same as setting to 'normal' as it is the default
    this.gridApi.setGridOption("domLayout", undefined);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
