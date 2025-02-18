import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  EventApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IAggregationStatusPanelParams,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  StatusPanelDef,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { CellSelectionModule, StatusBarModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  StatusBarModule,
  RowApiModule,
  EventApiModule,
  ValidationModule /* Development Only */,
]);
import { ClickableStatusBarComponent } from "./clickable-status-bar-component.component";
import { CountStatusBarComponent } from "./count-status-bar-component.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [
    AgGridAngular,
    ClickableStatusBarComponent,
    CountStatusBarComponent,
  ],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [rowSelection]="rowSelection"
    [statusBar]="statusBar"
  /> `,
})
export class AppComponent {
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
        statusPanel: CountStatusBarComponent,
      },
      {
        statusPanel: ClickableStatusBarComponent,
      },
      {
        statusPanel: "agAggregationComponent",
        statusPanelParams: {
          aggFuncs: ["count", "sum"],
        } as IAggregationStatusPanelParams,
      },
    ],
  };
}
