import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
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
  template: `<div class="example-wrapper">
    <div>
      <div class="button-group">
        <button (click)="saveFilterModel()">Save Filter Model</button>
        <button (click)="restoreFilterModel()">
          Restore Saved Filter Model
        </button>
        <button
          (click)="restoreFromHardCoded()"
          title="Name = 'Mich%', Country = ['Ireland', 'United States'], Age < 30, Date < 01/01/2010"
        >
          Set Custom Filter Model
        </button>
        <button (click)="clearFilters()">Reset Filters</button>
        <button (click)="destroyFilter()">Destroy Filter</button>
      </div>
    </div>
    <div>
      <div class="button-group">
        Saved Filters: <span id="savedFilters">(none)</span>
      </div>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country" },
    { field: "year", maxWidth: 100 },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: filterParams,
    },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  clearFilters() {
    this.gridApi.setFilterModel(null);
  }

  saveFilterModel() {
    savedFilterModel = this.gridApi.getFilterModel();
    const keys = Object.keys(savedFilterModel);
    const savedFilters: string = keys.length > 0 ? keys.join(", ") : "(none)";
    (document.querySelector("#savedFilters") as any).textContent = savedFilters;
  }

  restoreFilterModel() {
    this.gridApi.setFilterModel(savedFilterModel);
  }

  restoreFromHardCoded() {
    const hardcodedFilter = {
      country: {
        type: "set",
        values: ["Ireland", "United States"],
      },
      age: { type: "lessThan", filter: "30" },
      athlete: { type: "startsWith", filter: "Mich" },
      date: { type: "lessThan", dateFrom: "2010-01-01" },
    };
    this.gridApi.setFilterModel(hardcodedFilter);
  }

  destroyFilter() {
    this.gridApi.destroyFilter("athlete");
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    params.api.getToolPanelInstance("filters")!.expandFilters();

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

const filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};
let savedFilterModel: any = null;
