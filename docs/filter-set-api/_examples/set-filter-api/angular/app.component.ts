import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilter,
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <div>
        Athlete:
        <button (click)="selectNothing()">API: Filter empty set</button>
        <button (click)="selectJohnAndKenny()">
          API: Filter only John Joe Nevin and Kenny Egan
        </button>
        <button (click)="selectEverything()">API: Remove filter</button>
      </div>
      <div style="padding-top: 10px">
        Country - available filter values
        <button (click)="setCountriesToFranceAustralia()">
          Filter values restricted to France and Australia
        </button>
        <button (click)="setCountriesToAll()">
          Make all countries available
        </button>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      field: "athlete",
      filter: "agSetColumnFilter",
    },
    {
      field: "country",
      valueFormatter: (params: ValueFormatterParams) => {
        return `${params.value.name} (${params.value.code})`;
      },
      keyCreator: countryKeyCreator,
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => params.value.name,
      } as ISetFilterParams,
    },
    { field: "age", maxWidth: 120, filter: "agNumberColumnFilter" },
    { field: "year", maxWidth: 120 },
    { field: "date" },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 160,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }

  selectJohnAndKenny() {
    this.gridApi
      .setColumnFilterModel("athlete", {
        values: ["John Joe Nevin", "Kenny Egan"],
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  selectEverything() {
    this.gridApi.setColumnFilterModel("athlete", null).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  selectNothing() {
    this.gridApi.setColumnFilterModel("athlete", { values: [] }).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  setCountriesToFranceAustralia() {
    this.gridApi
      .getColumnFilterInstance<
        ISetFilter<{
          name: string;
          code: string;
        }>
      >("country")
      .then((instance) => {
        instance!.setFilterValues([
          {
            name: "France",
            code: "FR",
          },
          {
            name: "Australia",
            code: "AU",
          },
        ]);
        instance!.applyModel();
        this.gridApi.onFilterChanged();
      });
  }

  setCountriesToAll() {
    this.gridApi
      .getColumnFilterInstance<
        ISetFilter<{
          name: string;
          code: string;
        }>
      >("country")
      .then((instance) => {
        instance!.resetFilterValues();
        instance!.applyModel();
        this.gridApi.onFilterChanged();
      });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        patchData(data);
        this.rowData = data;
      });
  }
}

function countryKeyCreator(params: KeyCreatorParams) {
  return params.value.name;
}
function patchData(data: any[]) {
  // hack the data, replace each country with an object of country name and code
  data.forEach((row) => {
    const countryName = row.country;
    const countryCode = countryName.substring(0, 2).toUpperCase();
    row.country = {
      name: countryName,
      code: countryCode,
    };
  });
}
