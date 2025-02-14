import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  ExternalFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  IRowNode,
  IsExternalFilterPresentParams,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ExternalFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <label>
        <input
          type="radio"
          name="filter"
          id="everyone"
          (change)="externalFilterChanged('everyone')"
        />
        Everyone
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          id="below25"
          (change)="externalFilterChanged('below25')"
        />
        Below 25
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          id="between25and50"
          (change)="externalFilterChanged('between25and50')"
        />
        Between 25 and 50
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          id="above50"
          (change)="externalFilterChanged('above50')"
        />
        Above 50
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          id="dateAfter2008"
          (change)="externalFilterChanged('dateAfter2008')"
        />
        After 01/01/2008
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [isExternalFilterPresent]="isExternalFilterPresent"
      [doesExternalFilterPass]="doesExternalFilterPass"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 180 },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 80 },
    { field: "country" },
    { field: "year", maxWidth: 90 },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  externalFilterChanged(newValue: string) {
    ageType = newValue;
    this.gridApi.onFilterChanged();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        (document.querySelector("#everyone") as HTMLInputElement).checked =
          true;
        this.rowData = data;
      });
  }

  isExternalFilterPresent = (): boolean => {
    // if ageType is not everyone, then we are filtering
    return ageType !== "everyone";
  };

  doesExternalFilterPass = (node: IRowNode<IOlympicData>): boolean => {
    if (node.data) {
      switch (ageType) {
        case "below25":
          return node.data.age < 25;
        case "between25and50":
          return node.data.age >= 25 && node.data.age <= 50;
        case "above50":
          return node.data.age > 50;
        case "dateAfter2008":
          return asDate(node.data.date) > new Date(2008, 1, 1);
        default:
          return true;
      }
    }
    return true;
  };
}

const dateFilterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const cellDate = asDate(cellValue);
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
let ageType = "everyone";
function asDate(dateAsString: string) {
  const splitFields = dateAsString.split("/");
  return new Date(
    Number.parseInt(splitFields[2]),
    Number.parseInt(splitFields[1]) - 1,
    Number.parseInt(splitFields[0]),
  );
}
