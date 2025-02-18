import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IMultiFilter,
  IMultiFilterParams,
  ISetFilter,
  ITextFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 1rem">
      <button (click)="getTextModel()">Print Text Filter model</button>
      <button (click)="getSetMiniFilter()">Print Set Filter search text</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      field: "athlete",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: {
              buttons: ["apply", "clear"],
            } as ITextFilterParams,
          },
          {
            filter: "agSetColumnFilter",
          },
        ],
      } as IMultiFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  getTextModel() {
    this.gridApi
      .getColumnFilterInstance<IMultiFilter>("athlete")
      .then((multiFilterInstance) => {
        const textFilter = multiFilterInstance!.getChildFilterInstance(0)!;
        console.log("Current Text Filter model: ", textFilter.getModel());
      });
  }

  getSetMiniFilter() {
    this.gridApi
      .getColumnFilterInstance<IMultiFilter>("athlete")
      .then((multiFilterInstance) => {
        const setFilter = multiFilterInstance!.getChildFilterInstance(
          1,
        ) as ISetFilter;
        console.log(
          "Current Set Filter search text: ",
          setFilter.getMiniFilter(),
        );
      });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
