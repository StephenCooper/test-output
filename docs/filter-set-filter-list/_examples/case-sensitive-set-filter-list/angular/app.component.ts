import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
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
  template: `<div style="display: flex; flex-direction: column; height: 100%">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Case Insensitive (default)",
      field: "colour",
      filter: "agSetColumnFilter",
      filterParams: {
        caseSensitive: false,
        cellRenderer: colourCellRenderer,
      } as ISetFilterParams,
    },
    {
      headerName: "Case Sensitive",
      field: "colour",
      filter: "agSetColumnFilter",
      filterParams: {
        caseSensitive: true,
        cellRenderer: colourCellRenderer,
      } as ISetFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 225,
    cellRenderer: colourCellRenderer,
    floatingFilter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData: any[] | null = getData();

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }
}

const FIXED_STYLES =
  "vertical-align: middle; border: 1px solid black; margin: 3px; display: inline-block; width: 10px; height: 10px";
function colourCellRenderer(params: ICellRendererParams) {
  if (!params.value || params.value === "(Select All)") {
    return params.value;
  }
  return `<div style="background-color: ${params.value.toLowerCase()}; ${FIXED_STYLES}"></div>${params.value}`;
}
