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
  IMultiFilterParams,
  IProvidedFilterParams,
  ISetFilter,
  ISetFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
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
  template: `<div class="example-wrapper">
    <div class="example-header">
      <span class="button-group">
        <button (click)="irelandAndUk()">Ireland &amp; UK</button>
        <button (click)="endingStan()">Countries Ending 'stan'</button>
        <button (click)="printCountryModel()">Print Country</button>
        <button (click)="clearCountryFilter()">Clear Country</button>
        <button (click)="destroyCountryFilter()">Destroy Country</button>
      </span>
      <span class="button-group">
        <button (click)="ageBelow25()">Age Below 25</button>
        <button (click)="ageAbove30()">Age Above 30</button>
        <button (click)="ageBelow25OrAbove30()">
          Age Below 25 or Above 30
        </button>
        <button (click)="ageBetween25And30()">Age Between 25 and 30</button>
        <button (click)="clearAgeFilter()">Clear Age Filter</button>
      </span>
      <span class="button-group">
        <button (click)="after2010()">Date after 01/01/2010</button>
        <button (click)="before2012()">Date before 01/01/2012</button>
        <button (click)="dateCombined()">Date combined</button>
        <button (click)="clearDateFilter()">Clear Date Filter</button>
      </span>
      <span class="button-group">
        <button (click)="sportStartsWithS()">Sport starts with S</button>
        <button (click)="sportEndsWithG()">Sport ends with G</button>
        <button (click)="sportsCombined()">
          Sport starts with S and ends with G
        </button>
        <button (click)="clearSportFilter()">Clear Sport Filter</button>
      </span>
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
      filter: "agTextColumnFilter",
      filterParams: defaultFilterParams,
    },
    {
      field: "age",
      filter: "agNumberColumnFilter",
      filterParams: defaultFilterParams,
    },
    {
      field: "country",
      filter: "agSetColumnFilter",
      filterParams: defaultFilterParams,
    },
    {
      field: "year",
      maxWidth: 120,
      filter: "agNumberColumnFilter",
      filterParams: defaultFilterParams,
    },
    {
      field: "date",
      minWidth: 215,
      filter: "agDateColumnFilter",
      filterParams: {
        readOnly: true,
        comparator: dateComparator,
      } as IDateFilterParams,
      suppressHeaderMenuButton: true,
    },
    {
      field: "sport",
      suppressHeaderMenuButton: true,
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: { readOnly: true } as ITextFilterParams,
          },
          {
            filter: "agSetColumnFilter",
            filterParams: { readOnly: true } as ISetFilterParams,
          },
        ],
        readOnly: true,
      } as IMultiFilterParams,
    },
    { field: "gold", filterParams: defaultFilterParams },
    { field: "silver", filterParams: defaultFilterParams },
    { field: "bronze", filterParams: defaultFilterParams },
    { field: "total", filter: false },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    floatingFilter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  irelandAndUk() {
    this.gridApi
      .setColumnFilterModel("country", { values: ["Ireland", "Great Britain"] })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  clearCountryFilter() {
    this.gridApi.setColumnFilterModel("country", null).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  destroyCountryFilter() {
    this.gridApi.destroyFilter("country");
  }

  endingStan() {
    this.gridApi
      .getColumnFilterInstance<ISetFilter>("country")
      .then((countryFilterComponent) => {
        const countriesEndingWithStan = countryFilterComponent!
          .getFilterKeys()
          .filter(function (value: any) {
            return value.indexOf("stan") === value.length - 4;
          });
        this.gridApi
          .setColumnFilterModel("country", { values: countriesEndingWithStan })
          .then(() => {
            this.gridApi.onFilterChanged();
          });
      });
  }

  printCountryModel() {
    const model = this.gridApi.getColumnFilterModel("country");
    if (model) {
      console.log("Country model is: " + JSON.stringify(model));
    } else {
      console.log("Country model filter is not active");
    }
  }

  sportStartsWithS() {
    this.gridApi
      .setColumnFilterModel("sport", {
        filterModels: [
          {
            type: "startsWith",
            filter: "s",
          },
        ],
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  sportEndsWithG() {
    this.gridApi
      .setColumnFilterModel("sport", {
        filterModels: [
          {
            type: "endsWith",
            filter: "g",
          },
        ],
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  sportsCombined() {
    this.gridApi
      .setColumnFilterModel("sport", {
        filterModels: [
          {
            conditions: [
              {
                type: "endsWith",
                filter: "g",
              },
              {
                type: "startsWith",
                filter: "s",
              },
            ],
            operator: "AND",
          },
        ],
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  ageBelow25() {
    this.gridApi
      .setColumnFilterModel("age", {
        type: "lessThan",
        filter: 25,
        filterTo: null,
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  ageAbove30() {
    this.gridApi
      .setColumnFilterModel("age", {
        type: "greaterThan",
        filter: 30,
        filterTo: null,
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  ageBelow25OrAbove30() {
    this.gridApi
      .setColumnFilterModel("age", {
        conditions: [
          {
            type: "greaterThan",
            filter: 30,
            filterTo: null,
          },
          {
            type: "lessThan",
            filter: 25,
            filterTo: null,
          },
        ],
        operator: "OR",
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  ageBetween25And30() {
    this.gridApi
      .setColumnFilterModel("age", {
        type: "inRange",
        filter: 25,
        filterTo: 30,
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  clearAgeFilter() {
    this.gridApi.setColumnFilterModel("age", null).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  after2010() {
    this.gridApi
      .setColumnFilterModel("date", {
        type: "greaterThan",
        dateFrom: "2010-01-01",
        dateTo: null,
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  before2012() {
    this.gridApi
      .setColumnFilterModel("date", {
        type: "lessThan",
        dateFrom: "2012-01-01",
        dateTo: null,
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  dateCombined() {
    this.gridApi
      .setColumnFilterModel("date", {
        conditions: [
          {
            type: "lessThan",
            dateFrom: "2012-01-01",
            dateTo: null,
          },
          {
            type: "greaterThan",
            dateFrom: "2010-01-01",
            dateTo: null,
          },
        ],
        operator: "OR",
      })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  clearDateFilter() {
    this.gridApi.setColumnFilterModel("date", null).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  clearSportFilter() {
    this.gridApi.setColumnFilterModel("sport", null).then(() => {
      this.gridApi.onFilterChanged();
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

const defaultFilterParams: IProvidedFilterParams = { readOnly: true };
function dateComparator(filterLocalDateAtMidnight: Date, cellValue: Date) {
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
}
