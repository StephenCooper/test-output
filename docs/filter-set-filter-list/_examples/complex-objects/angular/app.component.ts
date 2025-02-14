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
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
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
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="printFilterModel()">Print Filter Model</button>
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
      headerName: "Country",
      field: "country",
      valueFormatter: countryValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        valueFormatter: countryValueFormatter,
        keyCreator: countryCodeKeyCreator,
      } as ISetFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    floatingFilter: true,
    cellDataType: false,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }

  printFilterModel() {
    const filterModel = this.gridApi.getFilterModel();
    console.log(filterModel);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // hack the data, replace each country with an object of country name and code.
        // also make country codes unique
        const uniqueCountryCodes: Map<string, string> = new Map();
        const newData: any[] = [];
        data.forEach(function (row: any) {
          const countryName = row.country;
          const countryCode = countryName.substring(0, 2).toUpperCase();
          const uniqueCountryName = uniqueCountryCodes.get(countryCode);
          if (!uniqueCountryName || uniqueCountryName === countryName) {
            uniqueCountryCodes.set(countryCode, countryName);
            row.country = {
              name: countryName,
              code: countryCode,
            };
            newData.push(row);
          }
        });
        params.api!.setGridOption("rowData", newData);
      });
  }
}

function countryCodeKeyCreator(params: KeyCreatorParams) {
  const countryObject = params.value;
  return countryObject.code;
}
function countryValueFormatter(params: ValueFormatterParams) {
  return params.value.name;
}
