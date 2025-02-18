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
    [sideBar]="sideBar"
    [rowData]="rowData"
    (firstDataRendered)="onFirstDataRendered($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Days (Values Not Provided)",
      field: "days",
      filter: "agSetColumnFilter",
      filterParams: daysValuesNotProvidedFilterParams,
    },
    {
      headerName: "Days (Values Provided)",
      field: "days",
      filter: "agSetColumnFilter",
      filterParams: daysValuesProvidedFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData: any[] | null = getRowData();

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }
}

const listOfDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const daysValuesNotProvidedFilterParams: ISetFilterParams = {
  comparator: (a: string | null, b: string | null) => {
    const aIndex = a == null ? -1 : listOfDays.indexOf(a);
    const bIndex = b == null ? -1 : listOfDays.indexOf(b);
    if (aIndex === bIndex) return 0;
    return aIndex > bIndex ? 1 : -1;
  },
};
const daysValuesProvidedFilterParams: ISetFilterParams = {
  values: listOfDays,
  suppressSorting: true, // use provided order
};
function getRowData() {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const rows = [];
  for (let i = 0; i < 200; i++) {
    const index = Math.floor(Math.random() * 5);
    rows.push({ days: weekdays[index] });
  }
  return rows;
}
