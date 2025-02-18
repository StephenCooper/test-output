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
  SetFilterValuesFuncParams,
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
    [rowData]="rowData"
    [columnDefs]="columnDefs"
  /> `,
})
export class AppComponent {
  rowData: any[] | null = [
    { value: "value 1" },
    { value: "value 1" },
    { value: "value 1" },
    { value: "value 1" },
    { value: "value 2" },
    { value: "value 2" },
    { value: "value 2" },
    { value: "value 2" },
    { value: "value 2" },
  ];
  columnDefs: ColDef[] = [
    {
      headerName: "Set filter column",
      field: "value",
      flex: 1,
      filter: "agSetColumnFilter",
      floatingFilter: true,
      filterParams: filterParams,
    },
  ];
}

const filterParams: ISetFilterParams = {
  values: (params: SetFilterValuesFuncParams) => {
    setTimeout(() => {
      params.success(["value 1", "value 2"]);
    }, 3000);
  },
};
