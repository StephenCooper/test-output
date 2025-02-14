import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  AdvancedFilterBuilderVisibleChangedEvent,
  AdvancedFilterModel,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  GridStateModule,
  IAdvancedFilterBuilderParams,
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
  template: `<div id="wrapper" class="example-wrapper">
    <div class="example-header">
      <div id="advancedFilterParent" class="parent"></div>
      <button id="advancedFilterBuilderButton" (click)="showBuilder()">
        Advanced Filter Builder
      </button>
      <i id="advancedFilterIcon" class="fa fa-filter filter-icon"></i>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [advancedFilterBuilderParams]="advancedFilterBuilderParams"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [enableAdvancedFilter]="true"
      [popupParent]="popupParent"
      [initialState]="initialState"
      [rowData]="rowData"
      (advancedFilterBuilderVisibleChanged)="
        onAdvancedFilterBuilderVisibleChanged($event)
      "
      (filterChanged)="onFilterChanged($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  advancedFilterBuilderParams: IAdvancedFilterBuilderParams = {
    showMoveButtons: true,
  };
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
  popupParent: HTMLElement | null = document.getElementById("wrapper");
  initialState: GridState = {
    filter: {
      advancedFilterModel: initialAdvancedFilterModel,
    },
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onAdvancedFilterBuilderVisibleChanged(
    event: AdvancedFilterBuilderVisibleChangedEvent<IOlympicData>,
  ) {
    const eButton = document.getElementById("advancedFilterBuilderButton")!;
    if (event.visible) {
      eButton.setAttribute("disabled", "");
    } else {
      eButton.removeAttribute("disabled");
    }
  }

  onFilterChanged() {
    const advancedFilterApplied = !!this.gridApi.getAdvancedFilterModel();
    document
      .getElementById("advancedFilterIcon")!
      .classList.toggle("filter-icon-disabled", !advancedFilterApplied);
  }

  showBuilder() {
    this.gridApi.showAdvancedFilterBuilder();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    // Could also be provided via grid option `advancedFilterParent`.
    // Setting the parent removes the Advanced Filter input from the grid,
    // allowing the Advanced Filter to be edited only via the Builder, launched via the API.
    params.api.setGridOption(
      "advancedFilterParent",
      document.getElementById("advancedFilterParent"),
    );

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
