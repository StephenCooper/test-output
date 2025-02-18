import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ISetFilter,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
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
  template: `<div class="example-wrapper">
    <div class="example-header">
      <div>
        Case Insensitive:
        <button (click)="setModel('insensitive')">
          API: setModel() - mismatching case
        </button>
        <button (click)="getModel('insensitive')">API: getModel()</button>
        <button (click)="setFilterValues('insensitive')">
          API: setFilterValues() - mismatching case
        </button>
        <button (click)="getValues('insensitive')">
          API: getFilterValues()
        </button>
        <button (click)="reset('insensitive')">Reset</button>
      </div>
      <div style="padding-top: 10px">
        Case Sensitive:
        <button (click)="setModel('sensitive')">
          API: setModel() - mismatching case
        </button>
        <button (click)="getModel('sensitive')">API: getModel()</button>
        <button (click)="setFilterValues('sensitive')">
          API: setFilterValues() - mismatching case
        </button>
        <button (click)="getValues('sensitive')">API: getFilterValues()</button>
        <button (click)="reset('sensitive')">Reset</button>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

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

  setModel(type: string) {
    this.gridApi
      .setColumnFilterModel(FILTER_TYPES[type], { values: MANGLED_COLOURS })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  getModel(type: string) {
    alert(
      JSON.stringify(
        this.gridApi.getColumnFilterModel(FILTER_TYPES[type]),
        null,
        2,
      ),
    );
  }

  setFilterValues(type: string) {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>(FILTER_TYPES[type])
      .then((instance) => {
        instance!.setFilterValues(MANGLED_COLOURS);
        instance!.applyModel();
        this.gridApi.onFilterChanged();
      });
  }

  getValues(type: string) {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>(FILTER_TYPES[type])
      .then((instance) => {
        alert(JSON.stringify(instance!.getFilterValues(), null, 2));
      });
  }

  reset(type: string) {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>(FILTER_TYPES[type])
      .then((instance) => {
        instance!.resetFilterValues();
        instance!.setModel(null).then(() => {
          this.gridApi.onFilterChanged();
        });
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

const FIXED_STYLES =
  "vertical-align: middle; border: 1px solid black; margin: 3px; display: inline-block; width: 10px; height: 10px";
const FILTER_TYPES: Record<string, string> = {
  insensitive: "colour",
  sensitive: "colour_1",
};
function colourCellRenderer(params: ICellRendererParams) {
  if (!params.value || params.value === "(Select All)") {
    return params.value;
  }
  return `<div style="background-color: ${params.value.toLowerCase()}; ${FIXED_STYLES}"></div>${params.value}`;
}
var MANGLED_COLOURS = ["ReD", "OrAnGe", "WhItE", "YeLlOw"];
