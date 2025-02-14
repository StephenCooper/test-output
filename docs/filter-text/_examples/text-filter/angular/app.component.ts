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
  ITextFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
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
      filterParams: athleteFilterParams,
    },
    {
      field: "country",
      filter: "agTextColumnFilter",
      filterParams: countryFilterParams,
    },
    {
      field: "sport",
      filter: "agTextColumnFilter",
      filterParams: {
        caseSensitive: true,
        defaultOption: "startsWith",
      } as ITextFilterParams,
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

function contains(target: string, lookingFor: string) {
  return target && target.indexOf(lookingFor) >= 0;
}
const athleteFilterParams: ITextFilterParams = {
  filterOptions: ["contains", "notContains"],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/æ/g, "ae")
      .replace(/ç/g, "c")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/ñ/g, "n")
      .replace(/[òóôõö]/g, "o")
      .replace(/œ/g, "oe")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y");
  },
  debounceMs: 200,
  maxNumConditions: 1,
};
const countryFilterParams: ITextFilterParams = {
  filterOptions: ["contains"],
  textMatcher: ({ value, filterText }) => {
    const aliases: Record<string, string> = {
      usa: "united states",
      holland: "netherlands",
      niall: "ireland",
      sean: "south africa",
      alberto: "mexico",
      john: "australia",
      xi: "china",
    };
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch || !!contains(value, aliases[filterText || ""]);
  },
  trimInput: true,
  debounceMs: 1000,
};
