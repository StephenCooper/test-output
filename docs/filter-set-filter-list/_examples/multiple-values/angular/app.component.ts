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
  KeyCreatorParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
  ValueGetterParams,
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
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [sideBar]="sideBar"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Animals (array)",
      field: "animalsArray",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Animals (string)",
      filter: "agSetColumnFilter",
      valueGetter: valueGetter,
    },
    {
      headerName: "Animals (objects)",
      field: "animalsObjects",
      filter: "agSetColumnFilter",
      valueFormatter: valueFormatter,
      keyCreator: (params: KeyCreatorParams) => params.value.name,
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) =>
          params.value ? params.value.name : "(Blanks)",
      } as ISetFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellDataType: false,
  };
  rowData: any[] | null = getData();
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
}

const valueGetter = function (params: ValueGetterParams) {
  return params.data["animalsString"].split("|");
};
const valueFormatter = function (params: ValueFormatterParams) {
  return params.value
    .map(function (animal: any) {
      return animal.name;
    })
    .join(", ");
};
