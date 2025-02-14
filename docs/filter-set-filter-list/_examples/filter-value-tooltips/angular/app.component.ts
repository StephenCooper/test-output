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
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { CustomTooltip } from "./customTooltip";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [sideBar]="sideBar"
    [defaultColDef]="defaultColDef"
    [tooltipShowDelay]="tooltipShowDelay"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "colA",
      tooltipField: "colA",
      filter: "agSetColumnFilter",
    },
    {
      field: "colB",
      tooltipField: "colB",
      filter: "agSetColumnFilter",
      filterParams: {
        showTooltips: true,
      } as ISetFilterParams,
    },
    {
      field: "colC",
      tooltipField: "colC",
      tooltipComponent: CustomTooltip,
      filter: "agSetColumnFilter",
      filterParams: {
        showTooltips: true,
      } as ISetFilterParams,
    },
  ];
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  defaultColDef: ColDef = {
    flex: 1,
  };
  tooltipShowDelay = 100;
  rowData: any[] | null = getData();
}
