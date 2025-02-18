import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  AdvancedFilterModel,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  GridStateModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  GridStateModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div>
      <div class="button-group">
        <button (click)="saveFilterModel()">Save Advanced Filter Model</button>
        <button (click)="restoreFilterModel()">
          Restore Saved Advanced Filter Model
        </button>
        <button (click)="restoreFromHardCoded()" title="[Gold] >= 1">
          Set Custom Advanced Filter Model
        </button>
        <button (click)="clearFilter()">Clear Advanced Filter</button>
      </div>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [enableAdvancedFilter]="true"
      [initialState]="initialState"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "age", minWidth: 100 },
    { field: "gold", minWidth: 100 },
    { field: "silver", minWidth: 100 },
    { field: "bronze", minWidth: 100 },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
    filter: true,
  };
  initialState: GridState = {
    filter: {
      advancedFilterModel: initialAdvancedFilterModel,
    },
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  saveFilterModel() {
    savedFilterModel = this.gridApi.getAdvancedFilterModel();
  }

  restoreFilterModel() {
    this.gridApi.setAdvancedFilterModel(savedFilterModel);
  }

  restoreFromHardCoded() {
    this.gridApi.setAdvancedFilterModel({
      filterType: "number",
      colId: "gold",
      type: "greaterThanOrEqual",
      filter: 1,
    });
  }

  clearFilter() {
    this.gridApi.setAdvancedFilterModel(null);
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

const initialAdvancedFilterModel: AdvancedFilterModel = {
  filterType: "join",
  type: "AND",
  conditions: [
    {
      filterType: "join",
      type: "OR",
      conditions: [
        {
          filterType: "number",
          colId: "age",
          type: "greaterThan",
          filter: 23,
        },
        {
          filterType: "text",
          colId: "sport",
          type: "endsWith",
          filter: "ing",
        },
      ],
    },
    {
      filterType: "text",
      colId: "country",
      type: "contains",
      filter: "united",
    },
  ],
};
let savedFilterModel: AdvancedFilterModel | null = null;
