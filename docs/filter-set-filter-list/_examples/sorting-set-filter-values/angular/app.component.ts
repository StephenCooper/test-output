import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
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
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
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
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [sideBar]="sideBar"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Age (No Comparator)",
      field: "age",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Age (With Comparator)",
      field: "age",
      filter: "agSetColumnFilter",
      filterParams: filterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    cellDataType: false,
  };
  rowData: any[] | null = getRowData();
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";

  onGridReady(params: GridReadyEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }
}

const filterParams: ISetFilterParams = {
  comparator: (a: string | null, b: string | null) => {
    const valA = a == null ? 0 : parseInt(a);
    const valB = b == null ? 0 : parseInt(b);
    if (valA === valB) return 0;
    return valA > valB ? 1 : -1;
  },
};
function getRowData() {
  const rows = [];
  for (let i = 1; i < 117; i++) {
    rows.push({ age: i });
  }
  return rows;
}
