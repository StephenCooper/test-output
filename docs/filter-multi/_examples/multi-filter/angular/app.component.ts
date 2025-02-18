import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  IMultiFilterParams,
  ISetFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

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
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", filter: "agMultiColumnFilter" },
    {
      field: "country",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: {
              defaultOption: "startsWith",
            } as ITextFilterParams,
          },
          {
            filter: "agSetColumnFilter",
          },
        ],
      } as IMultiFilterParams,
    },
    {
      field: "gold",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agNumberColumnFilter",
          },
          {
            filter: "agSetColumnFilter",
          },
        ],
      } as IMultiFilterParams,
    },
    {
      field: "date",
      filter: "agMultiColumnFilter",
      filterParams: dateFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ["filters"],
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

const dateFilterParams: IMultiFilterParams = {
  filters: [
    {
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterDate: Date, cellValue: string) => {
          if (cellValue == null) return -1;
          return getDate(cellValue).getTime() - filterDate.getTime();
        },
      } as IDateFilterParams,
    },
    {
      filter: "agSetColumnFilter",
      filterParams: {
        comparator: (a: string, b: string) => {
          return getDate(a).getTime() - getDate(b).getTime();
        },
      } as ISetFilterParams,
    },
  ],
};
function getDate(value: string): Date {
  const dateParts = value.split("/");
  return new Date(
    Number(dateParts[2]),
    Number(dateParts[1]) - 1,
    Number(dateParts[0]),
  );
}
