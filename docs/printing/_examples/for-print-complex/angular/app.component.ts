import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowGroupingDisplayType,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <button (click)="onBtPrint()">Print</button>

    <h3>Latin Text</h3>

    <p>
      Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
      neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri. Pro
      no ubique explicari, his reque nulla consequuntur in. His soleat doctus
      constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
    </p>

    <ag-grid-angular
      id="myGrid"
      style="width: 700px; height: 200px;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [groupDisplayType]="groupDisplayType"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />

    <h3>More Latin Text</h3>

    <p>
      Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
      neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri. Pro
      no ubique explicari, his reque nulla consequuntur in. His soleat doctus
      constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
    </p>
  `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "group", rowGroup: true, hide: true },
    { field: "id", pinned: "left", width: 70 },
    { field: "model", width: 180 },
    { field: "color", width: 100 },
    {
      field: "price",
      valueFormatter: "'$' + value.toLocaleString()",
      width: 100,
    },
    { field: "year", width: 100 },
    { field: "country", width: 120 },
  ];
  rowData: any[] | null = getData();
  groupDisplayType: RowGroupingDisplayType = "groupRows";

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.expandAll();
  }

  onBtPrint() {
    setPrinterFriendly(this.gridApi);
    setTimeout(() => {
      print();
      setNormal(this.gridApi);
    }, 2000);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function setPrinterFriendly(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
  eGridDiv.style.width = "";
  eGridDiv.style.height = "";
  api.setGridOption("domLayout", "print");
}
function setNormal(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
  eGridDiv.style.width = "700px";
  eGridDiv.style.height = "200px";
  api.setGridOption("domLayout", undefined);
}
