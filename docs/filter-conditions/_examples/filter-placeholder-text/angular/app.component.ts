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
  IFilterPlaceholderFunctionParams,
  INumberFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
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
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
    },
    {
      field: "country",
      filter: "agTextColumnFilter",
      filterParams: {
        filterPlaceholder: "Country...",
      } as ITextFilterParams,
    },
    {
      field: "sport",
      filter: "agTextColumnFilter",
      filterParams: {
        filterPlaceholder: (params: IFilterPlaceholderFunctionParams) => {
          const { filterOptionKey, placeholder } = params;
          return `${filterOptionKey} - ${placeholder}`;
        },
      } as ITextFilterParams,
    },
    {
      field: "total",
      filter: "agNumberColumnFilter",
      filterParams: {
        filterPlaceholder: (params: IFilterPlaceholderFunctionParams) => {
          const { filterOption } = params;
          return `${filterOption} total`;
        },
      } as INumberFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
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
