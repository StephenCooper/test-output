import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IMultiFilter,
  IServerSideDatasource,
  ISetFilter,
  KeyCreatorParams,
  ModuleRegistry,
  RowModelType,
  SetFilterValuesFuncParams,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  SetFilterModule,
  MultiFilterModule,
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
    [rowModelType]="rowModelType"
    [cacheBlockSize]="cacheBlockSize"
    [maxBlocksInCache]="maxBlocksInCache"
    [rowData]="rowData"
    (filterChanged)="onFilterChanged($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      field: "country",
      filter: "agSetColumnFilter",
      valueFormatter: countryValueFormatter,
      filterParams: {
        values: getCountryValuesAsync,
        keyCreator: countryCodeKeyCreator,
        valueFormatter: countryValueFormatter,
        comparator: countryComparator,
      },
    },
    {
      field: "sport",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: {
              defaultOption: "startsWith",
            },
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              values: getSportValuesAsync,
            },
          },
        ],
      },
      menuTabs: ["filterMenuTab"],
    },
    { field: "athlete" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };
  rowModelType: RowModelType = "serverSide";
  cacheBlockSize = 100;
  maxBlocksInCache = 10;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onFilterChanged() {
    const countryFilterModel = this.gridApi.getFilterModel()["country"];
    const sportFilterModel = this.gridApi.getFilterModel()["sport"];
    const selected = countryFilterModel && countryFilterModel.values;
    const textFilter = sportFilterModel?.filterModels[0]
      ? sportFilterModel.filterModels[0]
      : null;
    if (
      !areEqual(selectedCountries, selected) ||
      !areEqual(textFilterStored, textFilter)
    ) {
      selectedCountries = selected;
      textFilterStored = textFilter;
      console.log("Refreshing sports filter");
      this.gridApi
        .getColumnFilterInstance<IMultiFilter>("sport")
        .then((filter) => {
          filter!.getChildFilterInstance(1).refreshFilterValues();
        });
      this.gridApi
        .getColumnFilterInstance<ISetFilter>("country")
        .then((filter) => {
          filter!.refreshFilterValues();
        });
    }
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // we don't have unique codes in our dataset, so generate unique ones
        const namesToCodes: Map<string, string> = new Map();
        const codesToNames: Map<string, string> = new Map();
        data.forEach((row: any) => {
          row.countryName = row.country;
          if (namesToCodes.has(row.countryName)) {
            row.countryCode = namesToCodes.get(row.countryName);
          } else {
            row.countryCode = row.country.substring(0, 2).toUpperCase();
            if (codesToNames.has(row.countryCode)) {
              let num = 0;
              do {
                row.countryCode = `${row.countryCode[0]}${num++}`;
              } while (codesToNames.has(row.countryCode));
            }
            codesToNames.set(row.countryCode, row.countryName);
            namesToCodes.set(row.countryName, row.countryCode);
          }
          delete row.country;
        });
        // setup the fake server with entire dataset
        fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

function countryCodeKeyCreator(params: KeyCreatorParams): string {
  return params.value.code;
}
function countryValueFormatter(params: ValueFormatterParams): string {
  return params.value.name;
}
function countryComparator(
  a: {
    name: string;
    code: string;
  },
  b: {
    name: string;
    code: string;
  },
): number {
  // for complex objects, need to provide a comparator to choose what to sort by
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}
let fakeServer: any;
let selectedCountries: string[] | null = null;
let textFilterStored: string[] | null = null;
function areEqual(a: null | string[], b: null | string[]) {
  if (a == null && b == null) {
    return true;
  }
  if (a != null || b != null) {
    return false;
  }
  return (
    a!.length === b!.length &&
    a!.every(function (v, i) {
      return b![i] === v;
    })
  );
}
function getCountryValuesAsync(params: SetFilterValuesFuncParams) {
  const sportFilterModel = params.api.getFilterModel()["sport"];
  const countries = fakeServer.getCountries(sportFilterModel);
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(countries);
  }, 500);
}
function getSportValuesAsync(params: SetFilterValuesFuncParams) {
  const sportFilterModel = params.api.getFilterModel()["sport"];
  const sports = fakeServer.getSports(selectedCountries, sportFilterModel);
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(sports);
  }, 500);
}
function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      // get data for request from our fake server
      const response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}
