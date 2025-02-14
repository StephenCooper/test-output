import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  StatusPanelDef,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule, StatusBarModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  StatusBarModule,
  ValidationModule /* Development Only */,
]);
import { ClickableStatusBarComponent } from "./clickable-status-bar-component.component";

export interface IClickableStatusBar {
  setVisible(visible: boolean): void;
  isVisible(): boolean;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, ClickableStatusBarComponent],
  template: `<button
      (click)="toggleStatusBarComp()"
      style="margin-bottom: 10px"
    >
      Toggle Status Bar Component
    </button>
    <ag-grid-angular
      style="width: 100%; height: 90%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [rowSelection]="rowSelection"
      [statusBar]="statusBar"
      (gridReady)="onGridReady($event)"
    /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: "row",
    },
    {
      field: "name",
    },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  rowData: any[] | null = [
    { row: "Row 1", name: "Michael Phelps" },
    { row: "Row 2", name: "Natalie Coughlin" },
    { row: "Row 3", name: "Aleksey Nemov" },
    { row: "Row 4", name: "Alicia Coutts" },
    { row: "Row 5", name: "Missy Franklin" },
    { row: "Row 6", name: "Ryan Lochte" },
    { row: "Row 7", name: "Allison Schmitt" },
    { row: "Row 8", name: "Natalie Coughlin" },
    { row: "Row 9", name: "Ian Thorpe" },
    { row: "Row 10", name: "Bob Mill" },
    { row: "Row 11", name: "Willy Walsh" },
    { row: "Row 12", name: "Sarah McCoy" },
    { row: "Row 13", name: "Jane Jack" },
    { row: "Row 14", name: "Tina Wills" },
  ];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  statusBar: {
    statusPanels: StatusPanelDef[];
  } = {
    statusPanels: [
      {
        statusPanel: ClickableStatusBarComponent,
        key: "statusBarCompKey",
      },
      {
        statusPanel: "agAggregationComponent",
        statusPanelParams: {
          aggFuncs: ["count", "sum"],
        },
      },
    ],
  };

  toggleStatusBarComp() {
    const statusBarComponent =
      this.gridApi.getStatusPanel<IClickableStatusBar>("statusBarCompKey")!;
    statusBarComponent.setVisible(!statusBarComponent.isVisible());
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
