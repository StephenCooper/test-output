import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  NumberFilterModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  RowGroupingModule,
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
    [autoGroupColumnDef]="autoGroupColumnDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    { field: "athlete", hide: true },
    {
      field: "date",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
      } as ISetFilterParams<any, Date>,
    },
    {
      field: "gold",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        treeListPathGetter: (gold: number) =>
          gold != null ? [gold > 2 ? ">2" : "<=2", String(gold)] : [null],
      } as ISetFilterParams<any, number>,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    floatingFilter: true,
    cellDataType: false,
  };
  autoGroupColumnDef: ColDef = {
    field: "athlete",
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params: KeyCreatorParams) =>
        params.value ? params.value.join("#") : null,
    } as ISetFilterParams,
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe(
        (data) =>
          (this.rowData = data.map((row) => {
            const dateParts = row.date.split("/");
            const newDate = new Date(
              parseInt(dateParts[2]),
              dateParts[1] - 1,
              dateParts[0],
            );
            return { ...row, date: newDate };
          })),
      );
  }
}
